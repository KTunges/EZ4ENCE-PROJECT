from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.brand import Brand
from app.models.user import User
from app.schemas.brand import BrandCreate, BrandResponse
from app.routers.auth import get_current_admin, get_current_inventory
from app.routers.brands import invalidate_brands_cache

router = APIRouter(prefix="/admin/brands", tags=["Admin Brands"])

@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(
    brand_in: BrandCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_inventory)
):
    if db.query(Brand).filter(Brand.slug == brand_in.slug).first():
        raise HTTPException(status_code=400, detail="Brand with this slug already exists")
    
    new_brand = Brand(
        id=str(uuid.uuid4()),
        name=brand_in.name,
        slug=brand_in.slug,
        description=brand_in.description,
        logo_url=brand_in.logo_url
    )
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)
    invalidate_brands_cache()
    return new_brand

@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: str,
    brand_in: BrandCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_inventory)
):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
        
    if brand_in.slug != brand.slug:
        if db.query(Brand).filter(Brand.slug == brand_in.slug).first():
            raise HTTPException(status_code=400, detail="Brand with this slug already exists")
            
    brand.name = brand_in.name
    brand.slug = brand_in.slug
    brand.description = brand_in.description
    brand.logo_url = brand_in.logo_url
    
    db.commit()
    db.refresh(brand)
    invalidate_brands_cache()
    return brand

@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(
    brand_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_inventory)
):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
        
    db.delete(brand)
    db.commit()
    invalidate_brands_cache()
    return None
