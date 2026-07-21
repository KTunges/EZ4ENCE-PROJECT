from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.schemas.product import ProductSKUListResponse, ProductListResponse

class FlashSaleSkuResponse(ProductSKUListResponse):
    product: Optional[ProductListResponse] = None
    model_config = ConfigDict(from_attributes=True)

# ----- Flash Sale Item Schemas -----
class FlashSaleItemBase(BaseModel):
    product_sku_id: str
    flash_price: float
    quantity: int

class FlashSaleItemCreate(FlashSaleItemBase):
    pass

class FlashSaleItemUpdate(BaseModel):
    flash_price: Optional[float] = None
    quantity: Optional[int] = None
    sold: Optional[int] = None

class FlashSaleItemResponse(FlashSaleItemBase):
    id: str
    flash_sale_id: str
    sold: int
    sku: Optional[FlashSaleSkuResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ----- Flash Sale Schemas -----
class FlashSaleBase(BaseModel):
    name: str
    start_time: datetime
    end_time: datetime
    is_active: bool = True

class FlashSaleCreate(FlashSaleBase):
    items: Optional[List[FlashSaleItemCreate]] = []

class FlashSaleUpdate(BaseModel):
    name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    is_active: Optional[bool] = None

class FlashSaleResponse(FlashSaleBase):
    id: str
    created_at: datetime
    updated_at: datetime
    items: List[FlashSaleItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
