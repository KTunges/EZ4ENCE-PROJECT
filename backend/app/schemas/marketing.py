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
    final_discount: float
    message: str
