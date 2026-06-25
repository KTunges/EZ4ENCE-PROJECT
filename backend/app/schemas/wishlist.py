from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.product import ProductSKUResponse, ProductListResponse

class WishlistItemBase(BaseModel):
    sku_id: str

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistSKUResponse(ProductSKUResponse):
    product: Optional[ProductListResponse] = None

class WishlistItemResponse(WishlistItemBase):
    id: str
    user_id: str
    created_at: datetime
    sku: Optional[WishlistSKUResponse] = None

    class Config:
        from_attributes = True
