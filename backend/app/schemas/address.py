from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class AddressBase(BaseModel):
    full_name: str
    phone: str
    address_line: str
    ward: Optional[str] = None
    district: str
    city: str
    province_id: Optional[int] = None
    district_id: Optional[int] = None
    ward_code: Optional[str] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line: Optional[str] = None
    ward: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    province_id: Optional[int] = None
    district_id: Optional[int] = None
    ward_code: Optional[str] = None
    is_default: Optional[bool] = None

class AddressResponse(AddressBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
