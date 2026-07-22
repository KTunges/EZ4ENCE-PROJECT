from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
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
from app.models.order import Order
from app.schemas.marketing import PromotionApplyRequest, PromotionApplyResponse
from fastapi import HTTPException
from app.routers.auth import get_current_user_optional

@router.post("/promotions/apply", response_model=PromotionApplyResponse)
def apply_promotion(req: PromotionApplyRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    """
    Kiểm tra và tính toán giảm giá từ mã (logic giống Shopee)
    """
    now = datetime.now(timezone.utc)
    promotion = db.query(Promotion).filter(Promotion.code == req.code, Promotion.is_active == True).first()
    
    if not promotion:
        raise HTTPException(status_code=400, detail="Mã giảm giá không tồn tại hoặc đã hết hạn")
    
    # Kiểm tra ngày bắt đầu
    if promotion.start_date and promotion.start_date > now:
        raise HTTPException(status_code=400, detail="Mã giảm giá chưa đến thời gian áp dụng")
    
    # Kiểm tra ngày hết hạn
    if promotion.expiration_date and promotion.expiration_date < now:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết hạn sử dụng")
    
    # Kiểm tra tổng lượt sử dụng
    if promotion.usage_limit is not None and promotion.usage_count >= promotion.usage_limit:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết lượt sử dụng")
    
    # Kiểm tra giới hạn per-user (đếm từ bảng orders)
    if current_user and promotion.usage_limit_per_user:
        user_usage_count = db.query(Order).filter(
            Order.promotion_id == promotion.id,
            Order.user_id == current_user.id
        ).count()
        if user_usage_count >= promotion.usage_limit_per_user:
            raise HTTPException(status_code=400, detail=f"Bạn đã sử dụng mã này {user_usage_count} lần (tối đa {promotion.usage_limit_per_user} lần)")
        
    # Kiểm tra giá trị đơn hàng tối thiểu
    if req.order_value < promotion.min_order_value:
        raise HTTPException(status_code=400, detail=f"Đơn hàng tối thiểu {promotion.min_order_value:,.0f}đ để áp dụng mã này")
        
    # Tính toán giảm giá
    final_discount = 0
    base_value = req.order_value if promotion.type == 'product' else req.shipping_fee

    if promotion.discount_percent:
        final_discount = base_value * (promotion.discount_percent / 100)
        # Áp dụng giới hạn giảm tối đa
        if promotion.max_discount_amount and final_discount > promotion.max_discount_amount:
            final_discount = promotion.max_discount_amount
    elif promotion.discount_amount:
        final_discount = promotion.discount_amount
        
    # Không giảm quá giá trị gốc (order_value hoặc shipping_fee)
    if final_discount > base_value:
        final_discount = base_value
        
    return {
        "id": promotion.id,
        "code": promotion.code,
        "type": promotion.type,
        "discount_amount": promotion.discount_amount or 0,
        "discount_percent": promotion.discount_percent,
        "max_discount_amount": promotion.max_discount_amount,
        "final_discount": final_discount,
        "message": "Áp dụng mã giảm giá thành công"
    }

from app.schemas.marketing import PromotionResponse

@router.get("/promotions/available", response_model=List[PromotionResponse])
def get_available_promotions(db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    """
    Lấy danh sách các mã giảm giá đang hoạt động và công khai (is_public = True)
    Loại bỏ những mã mà user đã dùng hết lượt.
    """
    now = datetime.now(timezone.utc)
    query = db.query(Promotion).filter(
        Promotion.is_active == True,
        Promotion.is_public == True
    )
    
    # Lọc mã còn hạn
    query = query.filter(
        (Promotion.start_date == None) | (Promotion.start_date <= now)
    ).filter(
        (Promotion.expiration_date == None) | (Promotion.expiration_date >= now)
    )
    
    # Lọc mã còn lượt sử dụng (toàn cục)
    query = query.filter(
        (Promotion.usage_limit == None) | (Promotion.usage_count < Promotion.usage_limit)
    )
    
    promotions = query.all()
    
    # Nếu có user đăng nhập, lọc bỏ những mã đã đạt giới hạn sử dụng per-user
    if current_user and promotions:
        promo_ids = [p.id for p in promotions]
        
        user_promo_counts = dict(
            db.query(Order.promotion_id, func.count(Order.id))
            .filter(Order.user_id == current_user.id, Order.promotion_id.in_(promo_ids))
            .group_by(Order.promotion_id)
            .all()
        )
        
        user_shipping_promo_counts = dict(
            db.query(Order.shipping_promotion_id, func.count(Order.id))
            .filter(Order.user_id == current_user.id, Order.shipping_promotion_id.in_(promo_ids))
            .group_by(Order.shipping_promotion_id)
            .all()
        )
        
        valid_promos = []
        for p in promotions:
            if p.usage_limit_per_user:
                total_user_usage = user_promo_counts.get(p.id, 0) + user_shipping_promo_counts.get(p.id, 0)
                if total_user_usage < p.usage_limit_per_user:
                    valid_promos.append(p)
            else:
                valid_promos.append(p)
                
        return valid_promos

    return promotions

@router.get("/promotions/code/{code}", response_model=PromotionResponse)
def get_promotion_by_code(code: str, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    """
    Lấy thông tin một mã giảm giá cụ thể (dành cho mã ẩn)
    """
    now = datetime.now(timezone.utc)
    p = db.query(Promotion).filter(
        Promotion.code == code.upper(),
        Promotion.is_active == True
    ).first()
    
    if not p:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại")
        
    if p.start_date and p.start_date > now:
        raise HTTPException(status_code=400, detail="Mã giảm giá chưa đến thời gian áp dụng")
        
    if p.expiration_date and p.expiration_date < now:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết hạn")
        
    if p.usage_limit is not None and p.usage_count >= p.usage_limit:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết lượt sử dụng")
        
    if current_user and p.usage_limit_per_user:
        user_usage_count = db.query(Order).filter(
            Order.promotion_id == p.id,
            Order.user_id == current_user.id
        ).count()
        user_shipping_usage_count = db.query(Order).filter(
            Order.shipping_promotion_id == p.id,
            Order.user_id == current_user.id
        ).count()
        
        if (user_usage_count + user_shipping_usage_count) >= p.usage_limit_per_user:
            raise HTTPException(status_code=400, detail="Bạn đã dùng hết lượt mã này")
            
    return p
