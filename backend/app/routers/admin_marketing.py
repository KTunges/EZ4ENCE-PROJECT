from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from app.database import get_db
from app.models.marketing import Banner, Promotion
from app.schemas.marketing import BannerResponse, BannerCreate, BannerUpdate, PromotionResponse, PromotionCreate
from app.routers.auth import get_current_admin, get_current_marketing

router = APIRouter(
    prefix="/admin/marketing",
    tags=["Admin Marketing"],
    dependencies=[Depends(get_current_marketing)]
)

# =======================
# POSITION LIMITS CONFIG
# =======================
# None = Unlimited (carousel/slider positions)
# int  = Max banners allowed simultaneously at this position
POSITION_LIMITS = {
    "hero_slider": None,          # Carousel - unlimited
    "bento_main": None,           # Carousel inside Bento - unlimited
    "bento_side_top": 1,          # Bento Side (Hình Trên) - max 1
    "bento_side_bottom": 1,       # Bento Side (Hình Dưới) - max 1
    "bento_bottom_left": 1,       # Bento Bottom (Hình Trái) - max 1
    "bento_bottom_middle": 1,     # Bento Bottom (Hình Giữa) - max 1
    "bento_bottom_right": 1,      # Bento Bottom (Hình Phải) - max 1
    "home_middle": 1,             # Fixed - only 1
    "home_bottom": 1,             # Fixed - only 1
    "sidebar_bottom": 1,          # Fixed - only 1
    "footer_banner": 1,           # Fixed - only 1
}

POSITION_LABELS = {
    "hero_slider": "Hero Slider (Trang chủ chính)",
    "bento_main": "Bento Main Carousel (Trang sản phẩm)",
    "bento_side_top": "Bento Side - Hình Trên (Trang SP)",
    "bento_side_bottom": "Bento Side - Hình Dưới (Trang SP)",
    "bento_bottom_left": "Bento Bottom - Hình Trái (Trang SP)",
    "bento_bottom_middle": "Bento Bottom - Hình Giữa (Trang SP)",
    "bento_bottom_right": "Bento Bottom - Hình Phải (Trang SP)",
    "home_middle": "Home Middle (Trang chủ - Giữa)",
    "home_bottom": "Home Bottom (Trang chủ - Dưới)",
    "sidebar_bottom": "Sidebar Bottom (Dưới Menu Danh mục)",
    "footer_banner": "Footer Banner (Chân trang)",
}


def _check_position_conflict(db: Session, position: str, start_date, end_date, exclude_banner_id: str = None):
    """
    Check if adding/activating a banner at this position would exceed the limit.
    Only counts banners that are active AND whose schedule overlaps with the new banner's schedule.
    """
    limit = POSITION_LIMITS.get(position)
    if limit is None:
        return  # No limit for this position (carousel)

    now = datetime.now(timezone.utc)
    # Default time range: if no dates specified, treat as "always active"
    check_start = start_date or datetime.min.replace(tzinfo=timezone.utc)
    check_end = end_date or datetime.max.replace(tzinfo=timezone.utc)

    # Find all active banners at this position whose schedule overlaps
    query = db.query(Banner).filter(
        Banner.position == position,
        Banner.is_active == True
    )

    if exclude_banner_id:
        query = query.filter(Banner.id != exclude_banner_id)

    # Overlap logic: two time ranges overlap if start1 < end2 AND start2 < end1
    overlapping = []
    for b in query.all():
        b_start = b.start_date or datetime.min.replace(tzinfo=timezone.utc)
        b_end = b.end_date or datetime.max.replace(tzinfo=timezone.utc)
        if check_start < b_end and b_start < check_end:
            overlapping.append(b)

    if len(overlapping) >= limit:
        label = POSITION_LABELS.get(position, position)
        raise HTTPException(
            status_code=400,
            detail=f"Vị trí \"{label}\" chỉ cho phép tối đa {limit} banner hoạt động cùng lúc trong cùng khung giờ. "
                   f"Hiện đã có {len(overlapping)} banner đang chạy. Vui lòng tắt bớt hoặc chỉnh lại lịch chiếu."
        )


# =======================
# BANNERS
# =======================

@router.get("/banners", response_model=List[BannerResponse])
def get_all_banners(db: Session = Depends(get_db)):
    banners = db.query(Banner).order_by(Banner.created_at.desc()).all()
    return banners

@router.get("/position-limits")
def get_position_limits():
    """Return position config for frontend to display limits info."""
    return {
        "positions": [
            {"value": k, "label": v, "limit": POSITION_LIMITS.get(k)}
            for k, v in POSITION_LABELS.items()
        ]
    }

@router.post("/banners", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
def create_banner(banner_in: BannerCreate, db: Session = Depends(get_db)):
    # Validate position conflict before creating
    if banner_in.is_active:
        _check_position_conflict(db, banner_in.position, banner_in.start_date, banner_in.end_date)

    new_banner = Banner(
        id=str(uuid.uuid4()),
        title=banner_in.title,
        image_url=banner_in.image_url,
        link_url=banner_in.link_url,
        position=banner_in.position,
        is_active=banner_in.is_active,
        start_date=banner_in.start_date,
        end_date=banner_in.end_date
    )
    db.add(new_banner)
    db.commit()
    db.refresh(new_banner)
    return new_banner

@router.put("/banners/{banner_id}", response_model=BannerResponse)
def update_banner(banner_id: str, banner_in: BannerUpdate, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner không tồn tại.")

    # Determine effective values after update
    new_position = banner_in.position if banner_in.position is not None else banner.position
    new_active = banner_in.is_active if banner_in.is_active is not None else banner.is_active
    new_start = banner_in.start_date if banner_in.start_date is not None else banner.start_date
    new_end = banner_in.end_date if banner_in.end_date is not None else banner.end_date

    # Validate conflict if banner will be active
    if new_active:
        _check_position_conflict(db, new_position, new_start, new_end, exclude_banner_id=banner_id)

    # Apply updates
    if banner_in.title is not None:
        banner.title = banner_in.title
    if banner_in.image_url is not None:
        banner.image_url = banner_in.image_url
    if banner_in.link_url is not None:
        banner.link_url = banner_in.link_url
    if banner_in.position is not None:
        banner.position = banner_in.position
    if banner_in.is_active is not None:
        banner.is_active = banner_in.is_active
    if banner_in.start_date is not None:
        banner.start_date = banner_in.start_date
    if banner_in.end_date is not None:
        banner.end_date = banner_in.end_date

    db.commit()
    db.refresh(banner)
    return banner

@router.put("/banners/{banner_id}/toggle", response_model=BannerResponse)
def toggle_banner(banner_id: str, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner không tồn tại.")

    # If turning ON, check for position conflict
    if not banner.is_active:
        _check_position_conflict(db, banner.position, banner.start_date, banner.end_date, exclude_banner_id=banner_id)

    banner.is_active = not banner.is_active
    db.commit()
    db.refresh(banner)
    return banner

@router.delete("/banners/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_banner(banner_id: str, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner không tồn tại.")
    db.delete(banner)
    db.commit()
    return None

# =======================
# LINK BUILDER - search targets
# =======================
from app.models.product import Product
from app.models.category import Category

@router.get("/link-targets")
def get_link_targets(
    type: str = Query("product", description="product | category"),
    q: str = Query("", description="Search keyword"),
    db: Session = Depends(get_db)
):
    """Return list of linkable targets for the Link Builder UI."""
    results = []
    if type == "product":
        query = db.query(Product.id, Product.name, Product.slug).filter(Product.is_published == True)
        if q:
            query = query.filter(Product.name.ilike(f"%{q}%"))
        items = query.limit(20).all()
        results = [{"id": str(i.id), "name": i.name, "url": f"/products/{i.slug}"} for i in items]
    elif type == "category":
        query = db.query(Category.id, Category.name, Category.slug)
        if q:
            query = query.filter(Category.name.ilike(f"%{q}%"))
        items = query.limit(20).all()
        results = [{"id": str(i.id), "name": i.name, "url": f"/products?category={i.slug}"} for i in items]
    return results


# =======================
# PROMOTIONS / COUPONS
# =======================

@router.get("/promotions", response_model=List[PromotionResponse])
def get_all_promotions(db: Session = Depends(get_db)):
    promotions = db.query(Promotion).order_by(Promotion.created_at.desc()).all()
    return promotions

@router.post("/promotions", response_model=PromotionResponse, status_code=status.HTTP_201_CREATED)
def create_promotion(promo_in: PromotionCreate, db: Session = Depends(get_db)):
    # Check if code already exists
    existing = db.query(Promotion).filter(Promotion.code == promo_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mã giảm giá này đã tồn tại.")

    new_promo = Promotion(
        id=str(uuid.uuid4()),
        code=promo_in.code,
        type=promo_in.type,
        discount_percent=promo_in.discount_percent,
        discount_amount=promo_in.discount_amount,
        max_discount_amount=promo_in.max_discount_amount,
        min_order_value=promo_in.min_order_value,
        usage_limit=promo_in.usage_limit,
        usage_limit_per_user=promo_in.usage_limit_per_user,
        start_date=promo_in.start_date,
        expiration_date=promo_in.expiration_date,
        is_active=promo_in.is_active
    )
    db.add(new_promo)
    db.commit()
    db.refresh(new_promo)
    return new_promo

@router.put("/promotions/{promo_id}/toggle", response_model=PromotionResponse)
def toggle_promotion(promo_id: str, db: Session = Depends(get_db)):
    promo = db.query(Promotion).filter(Promotion.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại.")
    promo.is_active = not promo.is_active
    db.commit()
    db.refresh(promo)
    return promo

@router.delete("/promotions/{promo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion(promo_id: str, db: Session = Depends(get_db)):
    promo = db.query(Promotion).filter(Promotion.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại.")
    db.delete(promo)
    db.commit()
    return None
