from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    parent_id: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime
    product_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)

# Schema for hierarchical category tree
class CategoryTreeResponse(CategoryResponse):
    children: List['CategoryTreeResponse'] = []
    
    model_config = ConfigDict(from_attributes=True)
