import base64
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
import httpx
import logging
import datetime
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.order import Order, PaymentStatus
from app.utils.vnpay import VNPay

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/payment",
    tags=["payment"]
)

class PayPalOrderRequest(BaseModel):
    order_id: str # Dùng order_id thật từ db

class PayPalCaptureRequest(BaseModel):
    order_id: str # ID của PayPal Order (không phải ID đơn hàng trong DB)

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
    
    response = httpx.post(f"{base_url}/v1/oauth2/token", headers=headers, data=data)
    if response.status_code != 200:
        logger.error(f"Failed to get PayPal token: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to authenticate with PayPal")
        
    return response.json()["access_token"]

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
    
    response = httpx.post(f"{base_url}/v2/checkout/orders", headers=headers, json=payload)
    if response.status_code not in (200, 201):
        logger.error(f"Failed to create PayPal order: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to create PayPal order")
        
    data = response.json()
    return {"paypal_order_id": data["id"]}

@router.post("/paypal/capture-order")
def capture_paypal_order(req: PayPalCaptureRequest, db: Session = Depends(get_db)):
    access_token = get_paypal_access_token()
    base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_ENVIRONMENT == "sandbox" else "https://api-m.paypal.com"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = httpx.post(f"{base_url}/v2/checkout/orders/{req.order_id}/capture", headers=headers)
    
    if response.status_code in (200, 201):
        data = response.json()
        if data["status"] == "COMPLETED":
            order = db.query(Order).filter(Order.id == req.order_id).first()
            if order:
                order.payment_status = PaymentStatus.PAID
                order.payment_transaction_id = data.get("id")
                
                from app.models.order import OrderStatusHistory, OrderStatus
                import uuid
                history = OrderStatusHistory(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    status=order.status,
                    description=f"Thanh toán PayPal thành công. Mã GD: {data.get('id')}"
                )
                db.add(history)
                db.commit()
            return {"success": True, "data": data}
        
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
    
    amount = int(order.total_amount * 100) # VNPAY yêu cầu nhân 100
    
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = amount
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = req.order_id
    vnp.requestData['vnp_OrderInfo'] = f'Thanh toan don hang {req.order_id}'
    vnp.requestData['vnp_OrderType'] = 'billpayment'
    vnp.requestData['vnp_Locale'] = 'vn'
    
    # IP Client
    client_ip = request.client.host
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
def verify_vnpay_return(request: Request, db: Session = Depends(get_db)):
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

