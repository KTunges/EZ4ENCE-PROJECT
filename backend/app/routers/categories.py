from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryTreeResponse

router = APIRouter(tags=["Categories"])

def build_tree(categories, parent_id=None):
    tree = []
    for cat in categories:
        if cat.parent_id == parent_id:
            # We must map SQLAlchemy model to dict or let Pydantic handle it
            # Pydantic handles from_attributes, but we need to inject 'children'
            cat_dict = cat.__dict__.copy()
            cat_dict['product_count'] = cat.product_count
            cat_dict['children'] = build_tree(categories, cat.id)
            tree.append(cat_dict)
    return tree

import time as _time

_categories_cache = {"data": None, "timestamp": 0}
_CACHE_TTL = 300  # 5 minutes

def invalidate_categories_cache():
    _categories_cache["data"] = None
    _categories_cache["timestamp"] = 0

@router.get("/categories", response_model=List[CategoryTreeResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Lấy danh sách cây danh mục (Categories Tree) - Có Cache
    """
    now = _time.time()
    if _categories_cache["data"] is not None and now - _categories_cache["timestamp"] < _CACHE_TTL:
        return _categories_cache["data"]

    from sqlalchemy.orm import selectinload
    categories = db.query(Category).options(selectinload(Category.products)).all()
    # Build hierarchical tree
    tree = build_tree(categories, parent_id=None)
    
    _categories_cache["data"] = tree
    _categories_cache["timestamp"] = now
    
    return tree
