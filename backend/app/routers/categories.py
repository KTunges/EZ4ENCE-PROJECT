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

@router.get("/categories", response_model=List[CategoryTreeResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Lấy danh sách cây danh mục (Categories Tree)
    """
    categories = db.query(Category).all()
    # Build hierarchical tree
    tree = build_tree(categories, parent_id=None)
    return tree
