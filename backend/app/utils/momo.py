import hmac
import hashlib
import json
import httpx
from app.config import settings
import logging
import time

logger = logging.getLogger(__name__)

class MomoPayment:
    def __init__(self):
        self.partner_code = settings.MOMO_PARTNER_CODE
        self.access_key = settings.MOMO_ACCESS_KEY
        self.secret_key = settings.MOMO_SECRET_KEY
        self.endpoint = settings.MOMO_ENDPOINT
        self.return_url = settings.MOMO_RETURN_URL
        self.notify_url = settings.MOMO_NOTIFY_URL

    def create_payment_url(self, order_id: str, amount: int, order_info: str):
        request_id = f"{order_id}-{int(time.time())}"
        request_type = "payWithMethod"
        extra_data = ""
        
        # Format string for signature calculation
        raw_signature = (
            f"accessKey={self.access_key}&"
            f"amount={amount}&"
            f"extraData={extra_data}&"
            f"ipnUrl={self.notify_url}&"
            f"orderId={order_id}&"
            f"orderInfo={order_info}&"
            f"partnerCode={self.partner_code}&"
            f"redirectUrl={self.return_url}&"
            f"requestId={request_id}&"
            f"requestType={request_type}"
        )
        
        # Calculate HMAC SHA256
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            raw_signature.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        payload = {
            "partnerCode": self.partner_code,
            "partnerName": "EZ4ENCE",
            "storeId": "EZ4ENCE_STORE",
            "requestId": request_id,
            "amount": amount,
            "orderId": order_id,
            "orderInfo": order_info,
            "redirectUrl": self.return_url,
            "ipnUrl": self.notify_url,
            "lang": "vi",
            "requestType": request_type,
            "autoCapture": True,
            "extraData": extra_data,
            "signature": signature
        }
        
        headers = {'Content-Type': 'application/json'}
        try:
            response = httpx.post(self.endpoint, json=payload, headers=headers, timeout=15.0)
            data = response.json()
            if data.get("resultCode") == 0:
                return data.get("payUrl")
            else:
                logger.error(f"Momo create payment error: {data}")
                return None
        except Exception as e:
            logger.error(f"Momo HTTP request error: {e}")
            return None
            
    def verify_response(self, data: dict):
        """
        Verify the signature of the response from Momo
        """
        access_key = self.access_key
        amount = data.get("amount", "")
        extra_data = data.get("extraData", "")
        message = data.get("message", "")
        order_id = data.get("orderId", "")
        order_info = data.get("orderInfo", "")
        order_type = data.get("orderType", "")
        partner_code = data.get("partnerCode", "")
        pay_type = data.get("payType", "")
        request_id = data.get("requestId", "")
        response_time = data.get("responseTime", "")
        result_code = data.get("resultCode", "")
        trans_id = data.get("transId", "")
        received_signature = data.get("signature", "")
        
        raw_signature = (
            f"accessKey={access_key}&"
            f"amount={amount}&"
            f"extraData={extra_data}&"
            f"message={message}&"
            f"orderId={order_id}&"
            f"orderInfo={order_info}&"
            f"orderType={order_type}&"
            f"partnerCode={partner_code}&"
            f"payType={pay_type}&"
            f"requestId={request_id}&"
            f"responseTime={response_time}&"
            f"resultCode={result_code}&"
            f"transId={trans_id}"
        )
        
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            raw_signature.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature == received_signature
