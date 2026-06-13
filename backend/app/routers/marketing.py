from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.marketing import Banner
from app.schemas.marketing import BannerResponse
from datetime import datetime, timezone

router = APIRouter(tags=["Marketing"])

@router.get("/marketing/banners", response_model=List[BannerResponse])
def get_active_banners(position: str = None, db: Session = Depends(get_db)):
    """
    Lấy danh sách Banner đang hoạt động. Có thể lọc theo vị trí (position).
    """
    now = datetime.now(timezone.utc)
    query = db.query(Banner).filter(Banner.is_active == True)
    
    # Lọc banner còn hạn
    query = query.filter(
        (Banner.start_date == None) | (Banner.start_date <= now)
    ).filter(
        (Banner.end_date == None) | (Banner.end_date >= now)
    )
    
    if position:
        query = query.filter(Banner.position == position)
        
    return query.all()

from app.models.marketing import Promotion
from app.schemas.marketing import PromotionApplyRequest, PromotionApplyResponse
from fastapi import HTTPException

@router.post("/promotions/apply", response_model=PromotionApplyResponse)
def apply_promotion(req: PromotionApplyRequest, db: Session = Depends(get_db)):
    """
    Kiểm tra và tính toán giảm giá từ mã
    """
    now = datetime.now(timezone.utc)
    promotion = db.query(Promotion).filter(Promotion.code == req.code, Promotion.is_active == True).first()
    
    if not promotion:
        raise HTTPException(status_code=400, detail="Mã giảm giá không tồn tại hoặc đã hết hạn")
        
    if promotion.expiration_date and promotion.expiration_date < now:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết hạn sử dụng")
        
    if req.order_value < promotion.min_order_value:
        raise HTTPException(status_code=400, detail=f"Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này (Tối thiểu: {promotion.min_order_value}đ)")
        
    final_discount = 0
    if promotion.discount_percent:
        final_discount = req.order_value * (promotion.discount_percent / 100)
    elif promotion.discount_amount:
        final_discount = promotion.discount_amount
        
    if final_discount > req.order_value:
        final_discount = req.order_value
        
    return {
        "id": promotion.id,
        "code": promotion.code,
        "discount_amount": promotion.discount_amount or 0,
        "discount_percent": promotion.discount_percent,
        "final_discount": final_discount,
        "message": "Áp dụng mã giảm giá thành công"
    }
