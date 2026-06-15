from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class ReviewImageResponse(BaseModel):
    id: str
    url: str

    model_config = ConfigDict(from_attributes=True)

class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class AdminReviewResponse(ReviewBase):
    id: str
    user_id: str
    sku_id: str
    created_at: datetime
    
    # Custom fields for admin display
    user_name: Optional[str] = None
    product_name: Optional[str] = None
    images: List[ReviewImageResponse] = []

    model_config = ConfigDict(from_attributes=True)
