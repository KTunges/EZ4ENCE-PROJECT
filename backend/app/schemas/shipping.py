from pydantic import BaseModel
from typing import Optional, List

class ShippingFeeRequest(BaseModel):
    city: str
    district: str
    ward: Optional[str] = None
    province_name: Optional[str] = None
    district_name: Optional[str] = None
    ward_name: Optional[str] = None
    weight_grams: Optional[int] = 1000 # Mặc định 1kg
    total_amount: Optional[int] = 0

class ShippingOption(BaseModel):
    id: str # vd: ghn_standard, ghtk_fast
    provider: str # Giao Hàng Nhanh, Giao Hàng Tiết Kiệm
    service_name: str # Tiêu Chuẩn, Hoả Tốc
    fee: int
    estimated_delivery: str # vd: "2-3 ngày"
    logo: str

class ShippingFeeResponse(BaseModel):
    options: List[ShippingOption]
