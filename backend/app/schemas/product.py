from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    images: List[str] = []
    isPublished: bool = True

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
