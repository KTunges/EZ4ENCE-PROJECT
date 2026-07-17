from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse
from app.routers.auth import get_current_admin
from app.routers.categories import invalidate_categories_cache

router = APIRouter(prefix="/admin/categories", tags=["Admin Categories"])

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Check if slug exists
    if db.query(Category).filter(Category.slug == category_in.slug).first():
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    new_cat = Category(
        id=str(uuid.uuid4()),
        name=category_in.name,
        slug=category_in.slug,
        description=category_in.description,
        image=category_in.image,
        parent_id=category_in.parent_id
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    invalidate_categories_cache()
    return new_cat

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
        
    # Check slug collision
    if category_in.slug != cat.slug:
        if db.query(Category).filter(Category.slug == category_in.slug).first():
            raise HTTPException(status_code=400, detail="Category with this slug already exists")
            
    cat.name = category_in.name
    cat.slug = category_in.slug
    cat.description = category_in.description
    cat.image = category_in.image
    cat.parent_id = category_in.parent_id
    
    db.commit()
    db.refresh(cat)
    invalidate_categories_cache()
    return cat

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
        
    db.delete(cat)
    db.commit()
    invalidate_categories_cache()
    return None
