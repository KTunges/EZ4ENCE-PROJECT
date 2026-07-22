from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List

from app.database import get_db
from app.models.marketing import Banner, Promotion, UserSavedPromotion
from app.schemas.marketing import BannerResponse, PromotionResponse
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

from app.models.marketing import Promotion, UserSavedPromotion
from app.models.order import Order
from app.schemas.marketing import PromotionApplyRequest, PromotionApplyResponse
from fastapi import HTTPException
from app.routers.auth import get_current_user_optional, get_current_user

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
    
    if current_user:
        saved_promo_ids = db.query(UserSavedPromotion.promotion_id).filter(UserSavedPromotion.user_id == current_user.id)
        query = db.query(Promotion).filter(
            Promotion.is_active == True,
            or_(Promotion.is_public == True, Promotion.id.in_(saved_promo_ids))
        )
    else:
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
        valid_promos = []
        for p in promotions:
            if p.usage_limit_per_user:
                total_used = db.query(func.count(Order.id)).filter(
                    Order.user_id == current_user.id,
                    or_(Order.promotion_id == p.id, Order.shipping_promotion_id == p.id)
                ).scalar() or 0
                if total_used < p.usage_limit_per_user:
                    valid_promos.append(p)
            else:
                valid_promos.append(p)
                
        return valid_promos

    return promotions

@router.post("/promotions/save/{code}", response_model=PromotionResponse)
def save_promotion(code: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Lưu một mã giảm giá vào ví voucher của người dùng
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
        
    if p.usage_limit and p.usage_count >= p.usage_limit:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết lượt sử dụng")
        
    # Check limit per user
    if p.usage_limit_per_user:
        total_used = db.query(func.count(Order.id)).filter(
            Order.user_id == current_user.id,
            or_(Order.promotion_id == p.id, Order.shipping_promotion_id == p.id)
        ).scalar() or 0
        if total_used >= p.usage_limit_per_user:
            raise HTTPException(status_code=400, detail="Bạn đã hết lượt sử dụng mã này")
            
    # Check if already saved
    saved = db.query(UserSavedPromotion).filter(
        UserSavedPromotion.user_id == current_user.id,
        UserSavedPromotion.promotion_id == p.id
    ).first()
    
    if not saved:
        new_saved = UserSavedPromotion(user_id=current_user.id, promotion_id=p.id)
        db.add(new_saved)
        db.commit()
        
    return p

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
