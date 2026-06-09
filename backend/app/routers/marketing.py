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
