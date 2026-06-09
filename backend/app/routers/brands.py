from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandResponse

router = APIRouter(tags=["Brands"])

@router.get("/brands", response_model=List[BrandResponse])
def get_brands(db: Session = Depends(get_db)):
    """
    Lấy danh sách thương hiệu (Brands)
    """
    brands = db.query(Brand).all()
    return brands
