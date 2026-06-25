from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid

from app.database import get_db
from app.models.wishlist import WishlistItem
from app.models.product import ProductSKU, Product
from app.schemas.wishlist import WishlistItemResponse, WishlistItemCreate
from app.routers.auth import get_current_user

router = APIRouter(tags=["Wishlist"], prefix="/wishlist")

@router.get("", response_model=List[WishlistItemResponse])
def get_wishlist(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all wishlist items for the current user.
    """
    items = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id
    ).options(
        joinedload(WishlistItem.sku).joinedload(ProductSKU.product).joinedload(Product.images)
    ).all()
    
    return items

@router.post("", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    item_in: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Add a product SKU to wishlist.
    """
    # Check if SKU exists
    sku = db.query(ProductSKU).filter(ProductSKU.id == item_in.sku_id).first()
    if not sku:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product SKU not found")
        
    # Check if already in wishlist
    existing_item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.sku_id == item_in.sku_id
    ).first()
    
    if existing_item:
        # Already exists, just return it
        return existing_item
        
    # Create new item
    new_item = WishlistItem(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        sku_id=item_in.sku_id
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # Load relationships for response
    new_item = db.query(WishlistItem).filter(
        WishlistItem.id == new_item.id
    ).options(
        joinedload(WishlistItem.sku).joinedload(ProductSKU.product).joinedload(Product.images)
    ).first()
    
    return new_item

@router.delete("/{sku_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    sku_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Remove a product SKU from wishlist.
    """
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.sku_id == sku_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not in wishlist")
        
    db.delete(item)
    db.commit()
    return None
