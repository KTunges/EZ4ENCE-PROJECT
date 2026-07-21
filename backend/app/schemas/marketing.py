from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BannerBase(BaseModel):
    title: str
    image_url: str
    link_url: Optional[str] = None
    position: str
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class BannerCreate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PromotionApplyRequest(BaseModel):
    code: str
    order_value: float

class PromotionApplyResponse(BaseModel):
    id: str
    code: str
    discount_amount: float
    discount_percent: Optional[float] = None
    max_discount_amount: Optional[float] = None
    final_discount: float
    message: str

class PromotionBase(BaseModel):
    code: str
    discount_percent: Optional[float] = None
    discount_amount: Optional[float] = None
    max_discount_amount: Optional[float] = None
    min_order_value: float = 0
    usage_limit: Optional[int] = None
    usage_limit_per_user: int = 1
    start_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    is_active: bool = True

class PromotionCreate(PromotionBase):
    pass

class PromotionResponse(PromotionBase):
    id: str
    usage_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

