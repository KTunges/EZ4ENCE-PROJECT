from fastapi import APIRouter
from app.schemas.shipping import ShippingFeeRequest, ShippingFeeResponse
from app.services.shipping_service import ShippingService

router = APIRouter(prefix="/shipping", tags=["shipping"])

@router.post("/calculate", response_model=ShippingFeeResponse)
def calculate_shipping(req: ShippingFeeRequest):
    # Dùng API thật với province_id và district_id của GHN
    options = ShippingService.calculate_real_fee(
        to_district_id=int(req.district) if req.district.isdigit() else 0,
        to_ward_code=req.ward,
        weight_grams=req.weight_grams or 1000,
        to_province_name=req.province_name,
        to_district_name=req.district_name,
        to_ward_name=req.ward_name
    )
    return ShippingFeeResponse(options=options)

@router.get("/ghn/provinces")
def get_provinces():
    return ShippingService.get_ghn_provinces()

@router.get("/ghn/districts")
def get_districts(province_id: int):
    return ShippingService.get_ghn_districts(province_id)

@router.get("/ghn/wards")
def get_wards(district_id: int):
    return ShippingService.get_ghn_wards(district_id)
