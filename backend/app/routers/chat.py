from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict
from loguru import logger
from app.database import get_db
from app.models.chat import ChatSession, ChatMessage, SenderEnum
from app.models.user import User
from app.services.cloudinary_service import upload_image
from app.services.ai_service import ai_service

router = APIRouter(prefix="/chat", tags=["Live Chat"])

class ConnectionManager:
    def __init__(self):
        # client_id -> WebSocket
        self.active_customers: Dict[str, WebSocket] = {}
        # admin_id -> WebSocket (hoặc dùng list cho nhiều admin)
        self.active_admins: List[WebSocket] = []
        self.admin_global_status: str = "offline"

    async def connect_customer(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_customers[client_id] = websocket
        logger.info(f"Customer connected: {client_id}")
        
        # Gửi trạng thái admin hiện tại cho customer mới kết nối
        await websocket.send_json({
            "type": "status",
            "sender": "admin",
            "status": self.admin_global_status
        })

    def disconnect_customer(self, client_id: str, websocket: WebSocket):
        if client_id in self.active_customers:
            if self.active_customers[client_id] == websocket:
                del self.active_customers[client_id]
                logger.info(f"Customer disconnected: {client_id}")

    async def connect_admin(self, websocket: WebSocket):
        await websocket.accept()
        self.active_admins.append(websocket)
        logger.info("Admin connected to chat")

    def disconnect_admin(self, websocket: WebSocket):
        if websocket in self.active_admins:
            self.active_admins.remove(websocket)
            logger.info("Admin disconnected from chat")

    async def send_to_customer(self, client_id: str, message: dict):
        if client_id in self.active_customers:
            try:
                await self.active_customers[client_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending to customer {client_id}: {e}")
                # Optional: could remove the disconnected socket here if needed

    async def broadcast_to_admins(self, message: dict):
        for connection in self.active_admins:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to admin: {e}")

manager = ConnectionManager()

# WebSocket for Customers
@router.websocket("/ws/{client_id}")
async def websocket_customer_endpoint(websocket: WebSocket, client_id: str, db: Session = Depends(get_db)):
    await manager.connect_customer(websocket, client_id)
    
    # Ensure session exists
    session = db.query(ChatSession).filter(ChatSession.client_id == client_id).first()
    if not session:
        # Try to find user by ID
        user = db.query(User).filter(User.id == client_id).first()
        session = ChatSession(
            client_id=client_id,
            user_id=client_id if user else None,
            customer_name=user.full_name if user else None,
            customer_email=user.email if user else None
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    else:
        # If session exists but name is empty, try to populate it
        if not session.customer_name:
            user = db.query(User).filter(User.id == client_id).first()
            if user:
                session.user_id = client_id
                session.customer_name = user.full_name
                session.customer_email = user.email
                db.commit()
        
    try:
        while True:
            # Giao thức mới: nhận JSON
            data = await websocket.receive_json()
            event_type = data.get("type", "message")
            
            if event_type == "message":
                content = data.get("content")
                image_url = data.get("image_url")
                
                if not content and not image_url: continue
                # Save message to DB
                msg = ChatMessage(session_id=session.id, sender=SenderEnum.CUSTOMER, content=content, image_url=image_url)
                db.add(msg)
                
                # Unread count cho Admin
                session.unread_count = (session.unread_count or 0) + 1  # type: ignore
                db.commit()
                db.refresh(msg)
                
                payload = {
                    "type": "message",
                    "id": msg.id,
                    "session_id": session.id,
                    "client_id": client_id,
                    "customer_name": session.customer_name,
                    "sender": "customer",
                    "content": content,
                    "image_url": image_url,
                    "created_at": msg.created_at.isoformat()
                }
                
                # Send back to customer (acknowledgement / rendering)
                await manager.send_to_customer(client_id, payload)
                
                # Nếu Admin offline → AI tự động trả lời
                if manager.admin_global_status == "offline":
                    # Lấy lịch sử chat để AI có ngữ cảnh
                    history = db.query(ChatMessage).filter(
                        ChatMessage.session_id == session.id
                    ).order_by(ChatMessage.created_at).all()
                    history_dicts = [
                        {"sender": m.sender.value, "content": m.content}
                        for m in history if m.content
                    ]
                    
                    # Gọi Gemini AI
                    ai_reply_text = await ai_service.get_ai_response(history_dicts, content)
                    
                    # Lưu phản hồi AI vào DB (sender = ADMIN)
                    ai_msg = ChatMessage(
                        session_id=session.id,
                        sender=SenderEnum.ADMIN,
                        content=ai_reply_text
                    )
                    db.add(ai_msg)
                    db.commit()
                    db.refresh(ai_msg)
                    
                    ai_payload = {
                        "type": "message",
                        "id": ai_msg.id,
                        "session_id": session.id,
                        "client_id": client_id,
                        "customer_name": session.customer_name,
                        "sender": "ai",  # marker để frontend phân biệt AI vs Admin thật
                        "content": ai_reply_text,
                        "image_url": None,
                        "created_at": ai_msg.created_at.isoformat()
                    }
                    await manager.send_to_customer(client_id, ai_payload)
                else:
                    # Admin online → broadcast như bình thường
                    await manager.broadcast_to_admins(payload)
                
            elif event_type in ["typing", "read"]:
                # Chuyển tiếp sự kiện cho Admin
                await manager.broadcast_to_admins({
                    "type": event_type,
                    "client_id": client_id
                })
                
    except Exception as e:
        logger.warning(f"Customer {client_id} disconnected with error: {e}")
    finally:
        manager.disconnect_customer(client_id, websocket)

# WebSocket for Admins
@router.websocket("/ws/admin/connect")
async def websocket_admin_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect_admin(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type", "message")
            client_id = data.get("client_id")
            
            if event_type == "message":
                content = data.get("content")
                image_url = data.get("image_url")
                
                if not client_id or (not content and not image_url):
                    continue
                    
                session = db.query(ChatSession).filter(ChatSession.client_id == client_id).first()
                if not session:
                    continue
                    
                # Admin trả lời -> reset unread count
                session.unread_count = 0  # type: ignore
                
                # Save message
                msg = ChatMessage(session_id=session.id, sender=SenderEnum.ADMIN, content=content, image_url=image_url)
                db.add(msg)
                db.commit()
                db.refresh(msg)
                
                payload = {
                    "type": "message",
                    "id": msg.id,
                    "session_id": session.id,
                    "client_id": client_id,
                    "customer_name": session.customer_name,
                    "sender": "admin",
                    "content": content,
                    "image_url": image_url,
                    "created_at": msg.created_at.isoformat()
                }
                
                # Send to customer
                await manager.send_to_customer(client_id, payload)
                # Echo to all admins so they stay in sync
                await manager.broadcast_to_admins(payload)
                
            elif event_type in ["typing", "read"]:
                if client_id:
                    # Truyền sự kiện xuống cho Customer
                    await manager.send_to_customer(client_id, {
                        "type": event_type,
                        "sender": "admin"
                    })
                    
            elif event_type == "status":
                status = data.get("status") # 'online' | 'offline'
                logger.info(f"Admin changed status to: {status}")
                manager.admin_global_status = status
                # Phát trạng thái Admin cho tất cả khách hàng
                for cid in list(manager.active_customers.keys()):
                    await manager.send_to_customer(cid, {
                        "type": "status",
                        "sender": "admin",
                        "status": status
                    })
                
    except Exception as e:
        manager.disconnect_admin(websocket)

# REST API: Admin get all sessions
@router.get("/sessions")
def get_chat_sessions(db: Session = Depends(get_db)):
    # Có thể thêm auth check ở đây
    sessions = db.query(ChatSession).order_by(desc(ChatSession.updated_at)).all()
    result = []
    for s in sessions:
        last_msg = db.query(ChatMessage).filter(ChatMessage.session_id == s.id).order_by(desc(ChatMessage.created_at)).first()
        avatar = None
        if s.user_id:
            user = db.query(User).filter(User.id == s.user_id).first()
            if user:
                avatar = user.avatar

        result.append({
            "id": s.id,
            "client_id": s.client_id,
            "user_id": s.user_id,
            "customer_name": s.customer_name,
            "is_active": s.is_active,
            "updated_at": s.updated_at,
            "last_message": last_msg.content if last_msg else None,
            "last_message_time": last_msg.created_at if last_msg else None,
            "avatar": avatar
        })
    return result

# REST API: Get messages of a session
@router.get("/sessions/{client_id}/messages")
def get_session_messages(client_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.client_id == client_id).first()
    if not session:
        return []
    
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at).all()
    return [{"id": m.id, "sender": m.sender.value, "content": m.content, "image_url": m.image_url, "created_at": m.created_at} for m in messages]

# Resolve session
@router.put("/sessions/{session_id}/resolve")
def resolve_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    return {"message": "Session resolved successfully"}

@router.post("/upload-image")
async def upload_chat_image(file: UploadFile = File(...)):
    try:
        url = upload_image(file, folder="ez4gear/chat")
        return {"image_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
