from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class CartItemAddRequest(BaseModel):
    sku_id: str
    quantity: int = 1

class CartItemUpdateRequest(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: str
    cart_id: str
    sku_id: str
    quantity: int
    created_at: datetime
    
    # Extra product info flattened for frontend convenience
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    product_slug: Optional[str] = None
    sku_code: Optional[str] = None
    price: Optional[float] = None
    promotional_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    items: List[CartItemResponse] = []
    
    total_amount: float = 0
    total_items: int = 0

    model_config = ConfigDict(from_attributes=True)
