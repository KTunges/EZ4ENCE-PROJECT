from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.marketing import Banner, Promotion
from app.schemas.marketing import BannerResponse, BannerCreate, PromotionResponse, PromotionCreate
from app.routers.auth import get_current_admin

router = APIRouter(
    prefix="/admin/marketing",
    tags=["Admin Marketing"],
    dependencies=[Depends(get_current_admin)]
)

# =======================
# BANNERS
# =======================

@router.get("/banners", response_model=List[BannerResponse])
def get_all_banners(db: Session = Depends(get_db)):
    banners = db.query(Banner).order_by(Banner.created_at.desc()).all()
    return banners

@router.post("/banners", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
def create_banner(banner_in: BannerCreate, db: Session = Depends(get_db)):
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

@router.put("/banners/{banner_id}/toggle", response_model=BannerResponse)
def toggle_banner(banner_id: str, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner không tồn tại.")
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
