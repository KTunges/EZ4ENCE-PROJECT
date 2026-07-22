from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.models.order import OrderStatus, PaymentMethod, PaymentStatus

class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    sku_id: str
    product_name: str
    sku_code: str
    price_at_purchase: float
    quantity: int
    
    # Bổ sung field cho tiện
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BuyNowItem(BaseModel):
    sku_id: str
    quantity: int

class OrderCreateRequest(BaseModel):
    # Hỗ trợ chức năng mua ngay (không dùng giỏ hàng)
    buy_now_item: Optional[BuyNowItem] = None
    
    # Danh sách các ID của sản phẩm trong giỏ hàng được chọn để thanh toán
    selected_cart_item_ids: Optional[List[str]] = None
    
    # Dùng address_id nếu chọn từ sổ địa chỉ
    address_id: Optional[str] = None
    
    # Dùng raw fields nếu nhập mới
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line: Optional[str] = None
    ward: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    province_id: Optional[int] = None
    district_id: Optional[int] = None
    ward_code: Optional[str] = None
    
    payment_method: PaymentMethod
    shipping_fee: Optional[int] = 0
    shipping_provider: Optional[str] = None # vd: ghn_standard, ghtk_fast
    note: Optional[str] = None
    promotion_id: Optional[str] = None
    shipping_promotion_id: Optional[str] = None

from app.schemas.address import AddressResponse

class OrderStatusHistoryResponse(BaseModel):
    id: str
    status: OrderStatus
    description: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: str
    user_id: str
    address_id: str
    promotion_id: Optional[str] = None
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    payment_transaction_id: Optional[str] = None
    total_amount: float
    shipping_fee: float
    discount_amount: float
    shipping_discount: float = 0
    note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    items: List[OrderItemResponse] = []
    status_history: List[OrderStatusHistoryResponse] = []
    shipping_address: Optional[AddressResponse] = None

    model_config = ConfigDict(from_attributes=True)

class AdminOrderItemRequest(BaseModel):
    sku_id: str
    quantity: int
    custom_price: Optional[float] = None # Giữ lại nếu cần set giá custom, nếu None thì lấy giá hiện tại của SKU

class AdminOrderCreateRequest(BaseModel):
    user_id: str
    full_name: str
    phone: str
    address_line: str
    ward: str
    district: str
    city: str
    
    items: List[AdminOrderItemRequest]
    payment_method: PaymentMethod = PaymentMethod.COD
    payment_status: PaymentStatus = PaymentStatus.UNPAID
    shipping_fee: float = 0
    discount_amount: float = 0
    note: Optional[str] = None
