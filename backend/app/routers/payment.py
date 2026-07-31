import base64
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from pydantic import BaseModel
import httpx
import logging
import datetime
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.order import Order, PaymentStatus
from app.utils.vnpay import VNPay
from app.services.email_service import send_order_confirmation_email

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/payment",
    tags=["payment"]
)

class PayPalOrderRequest(BaseModel):
    order_id: str # Dùng order_id thật từ db

class PayPalCaptureRequest(BaseModel):
    paypal_order_id: str
    db_order_id: str | None = None # ID đơn hàng thật trong DB

def get_paypal_access_token():
    client_id = settings.PAYPAL_CLIENT_ID
    client_secret = settings.PAYPAL_CLIENT_SECRET
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="PayPal credentials not configured in backend")
        
    base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_ENVIRONMENT == "sandbox" else "https://api-m.paypal.com"
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')
    
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    try:
        response = httpx.post(f"{base_url}/v1/oauth2/token", headers=headers, data=data, timeout=5.0)
        if response.status_code != 200:
            logger.error(f"Failed to get PayPal token: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to authenticate with PayPal")
        return response.json()["access_token"]
    except httpx.RequestError as e:
        logger.error(f"PayPal Token Request Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi kết nối mạng đến máy chủ PayPal.")

@router.post("/paypal/create-order")
def create_paypal_order(req: PayPalOrderRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # Quy đổi tiền VNĐ sang USD (tỷ giá giả định 25000)
    total_usd = round(order.total_amount / 25000, 2)
    if total_usd <= 0:
        total_usd = 0.1 # Tránh lỗi số tiền bằng 0
    
    access_token = get_paypal_access_token()
    base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_ENVIRONMENT == "sandbox" else "https://api-m.paypal.com"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": str(total_usd)
                }
            }
        ]
    }
    
    try:
        response = httpx.post(f"{base_url}/v2/checkout/orders", headers=headers, json=payload, timeout=5.0)
        if response.status_code not in (200, 201):
            logger.error(f"Failed to create PayPal order: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to create PayPal order")
    except httpx.RequestError as e:
        logger.error(f"PayPal Create Order Request Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi kết nối mạng đến máy chủ PayPal khi tạo đơn.")
        
    data = response.json()
    # Trả về cả db_order_id để frontend gửi lại khi capture
    return {"paypal_order_id": data["id"], "db_order_id": req.order_id}

@router.post("/paypal/capture-order")
def capture_paypal_order(req: PayPalCaptureRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    access_token = get_paypal_access_token()
    base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_ENVIRONMENT == "sandbox" else "https://api-m.paypal.com"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = httpx.post(f"{base_url}/v2/checkout/orders/{req.paypal_order_id}/capture", headers=headers, timeout=10.0)
    except httpx.RequestError as e:
        logger.error(f"PayPal Capture Request Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi kết nối mạng đến máy chủ PayPal khi xác nhận.")
    
    if response.status_code in (200, 201):
        data = response.json()
        if data["status"] == "COMPLETED":
            
            # Lấy Mã giao dịch thực sự (Merchant Transaction ID) từ mảng captures
            capture_id = data.get("id")
            try:
                capture_id = data["purchase_units"][0]["payments"]["captures"][0]["id"]
            except (KeyError, IndexError, TypeError):
                pass
                
            # Dùng db_order_id (ID thật trong DB), fallback sang paypal_order_id
            lookup_id = req.db_order_id or req.paypal_order_id
            order = db.query(Order).filter(Order.id == lookup_id).first()
            total_amount = 0
            if order:
                order.payment_status = PaymentStatus.PAID
                order.payment_transaction_id = capture_id
                total_amount = order.total_amount
                
                from app.models.order import OrderStatusHistory, OrderStatus
                import uuid
                history = OrderStatusHistory(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    status=order.status,
                    description=f"Thanh toán PayPal thành công. Mã GD: {capture_id}"
                )
                db.add(history)
                db.commit()
                
                # Send confirmation email
                background_tasks.add_task(send_order_confirmation_email, order, order.user, order.shipping_address)
                
            return {"success": True, "total": total_amount, "data": data}
        
    logger.error(f"Failed to capture PayPal order: {response.text}")
    raise HTTPException(status_code=400, detail="Failed to capture payment")

# --- VNPAY ---

class VNPAYOrderRequest(BaseModel):
    order_id: str

@router.post("/vnpay/create-url")
def create_vnpay_url(req: VNPAYOrderRequest, request: Request, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    vnp = VNPay()
    
    amount = int(order.total_amount) * 100  # VNPAY yêu cầu nhân 100, đảm bảo là int rồi convert str
    
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = str(amount)
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = req.order_id
    vnp.requestData['vnp_OrderInfo'] = 'Thanh toan don hang ' + req.order_id
    vnp.requestData['vnp_OrderType'] = 'billpayment'
    vnp.requestData['vnp_Locale'] = 'vn'
    
    # IP Client
    client_ip = request.client.host if request.client else "127.0.0.1"
    if not client_ip:
        client_ip = "127.0.0.1"
    vnp.requestData['vnp_IpAddr'] = client_ip
    
    vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
    vnp.requestData['vnp_CreateDate'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    
    # Tính thời gian hết hạn (sau 15 phút)
    expire_date = datetime.datetime.now() + datetime.timedelta(minutes=15)
    vnp.requestData['vnp_ExpireDate'] = expire_date.strftime('%Y%m%d%H%M%S')
    
    vnpay_payment_url = vnp.get_payment_url()
    
    return {"payment_url": vnpay_payment_url}

@router.get("/vnpay/verify-return")
def verify_vnpay_return(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    inputData = request.query_params
    vnp = VNPay()
    vnp.responseData = dict(inputData)
    
    order_id = inputData.get('vnp_TxnRef')
    amount = int(inputData.get('vnp_Amount', 0)) / 100
    vnp_ResponseCode = inputData.get('vnp_ResponseCode')
    vnp_SecureHash = inputData.get('vnp_SecureHash')
    
    if vnp.validate_response(settings.VNPAY_HASH_SECRET):
        if vnp_ResponseCode == "00":
            # Giao dịch thành công
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.payment_status = PaymentStatus.PAID
                order.payment_transaction_id = inputData.get('vnp_TransactionNo')
                
                from app.models.order import OrderStatusHistory, OrderStatus
                import uuid
                history = OrderStatusHistory(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    status=order.status,
                    description=f"Thanh toán VNPay thành công. Mã GD: {inputData.get('vnp_TransactionNo')}"
                )
                db.add(history)
                db.commit()
                
                # Send confirmation email
                background_tasks.add_task(send_order_confirmation_email, order, order.user, order.shipping_address)
                
            return {
                "success": True, 
                "message": "Giao dịch thành công", 
                "order_id": order_id, 
                "amount": amount
            }
        else:
            return {"success": False, "message": f"Giao dịch thất bại. Mã lỗi: {vnp_ResponseCode}"}
    else:
        return {"success": False, "message": "Sai chữ ký bảo mật (Invalid Signature)"}

@router.post("/momo/create-url")
def create_momo_url(req: PayPalOrderRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    from app.utils.momo import MomoPayment
    momo = MomoPayment()
    
    amount = int(order.total_amount)
    order_info = f"Thanh toan don hang {req.order_id}"
    
    pay_url = momo.create_payment_url(req.order_id, amount, order_info)
    
    if pay_url:
        return {"payment_url": pay_url}
    else:
        raise HTTPException(status_code=500, detail="Lỗi khi tạo URL thanh toán Momo")

@router.get("/momo/verify-return")
def verify_momo_return(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    input_data = dict(request.query_params)
    
    from app.utils.momo import MomoPayment
    momo = MomoPayment()
    
    if momo.verify_response(input_data):
        result_code = input_data.get("resultCode")
        order_id = input_data.get("orderId")
        amount = int(input_data.get("amount", 0))
        trans_id = input_data.get("transId")
        
        if str(result_code) == "0":
            # Thành công
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.payment_status = PaymentStatus.PAID
                order.payment_transaction_id = str(trans_id)
                
                from app.models.order import OrderStatusHistory
                import uuid
                history = OrderStatusHistory(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    status=order.status,
                    description=f"Thanh toán Momo thành công. Mã GD: {trans_id}"
                )
                db.add(history)
                db.commit()
                
                # Send confirmation email
                background_tasks.add_task(send_order_confirmation_email, order, order.user, order.shipping_address)
                
            return {
                "success": True, 
                "message": "Giao dịch thành công", 
                "order_id": order_id, 
                "amount": amount
            }
        else:
            message = input_data.get("message", "Giao dịch thất bại")
            return {"success": False, "message": message}
    else:
        return {"success": False, "message": "Sai chữ ký bảo mật Momo (Invalid Signature)"}
