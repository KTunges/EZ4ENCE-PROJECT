import base64
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
import httpx
import logging
import datetime
from app.config import settings
from app.utils.vnpay import VNPay

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/payment",
    tags=["payment"]
)

class PayPalOrderRequest(BaseModel):
    amount_vnd: float # Giả lập truyền số tiền tổng từ frontend do chưa có API Orders

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
def create_paypal_order(req: PayPalOrderRequest):
    # Quy đổi tiền VNĐ sang USD (tỷ giá giả định 25000)
    total_usd = round(req.amount_vnd / 25000, 2)
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
def capture_paypal_order(req: PayPalCaptureRequest):
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
            # Nếu có API Order, ở đây sẽ cập nhật trạng thái đơn hàng trong Database
            return {"success": True, "data": data}
        
    logger.error(f"Failed to capture PayPal order: {response.text}")
    raise HTTPException(status_code=400, detail="Failed to capture payment")

# --- VNPAY ---

class VNPAYOrderRequest(BaseModel):
    amount_vnd: float

@router.post("/vnpay/create-url")
def create_vnpay_url(req: VNPAYOrderRequest, request: Request):
    vnp = VNPay()
    
    # Mã đơn hàng giả lập (vì chưa lưu DB)
    order_id = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    amount = int(req.amount_vnd * 100) # VNPAY yêu cầu nhân 100
    
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = amount
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = order_id
    vnp.requestData['vnp_OrderInfo'] = f'Thanh toan don hang {order_id}'
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
def verify_vnpay_return(request: Request):
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

