from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BrandBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
