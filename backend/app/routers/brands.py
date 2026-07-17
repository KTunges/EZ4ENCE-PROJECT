from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandResponse

router = APIRouter(tags=["Brands"])

import time as _time

_brands_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 300  # 5 minutes

def invalidate_brands_cache():
    _brands_cache["data"] = None
    _brands_cache["timestamp"] = 0

@router.get("/brands", response_model=List[BrandResponse])
def get_brands(db: Session = Depends(get_db)):
    """
    Lấy danh sách thương hiệu (Brands) - Có Cache
    """
    now = _time.time()
    if _brands_cache["data"] is not None and now - _brands_cache["timestamp"] < _CACHE_TTL:
        return _brands_cache["data"]

    brands = db.query(Brand).all()
    _brands_cache["data"] = brands
    _brands_cache["timestamp"] = now
    return brands
