from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.flash_sale import FlashSale, FlashSaleItem
from app.models.product import Product, ProductSKU
from app.schemas.flash_sale import FlashSaleResponse

router = APIRouter(
    prefix="/flash-sales",
    tags=["flash_sales"]
)

@router.get("/active", response_model=List[FlashSaleResponse])
def get_active_flash_sales(db: Session = Depends(get_db)):
    """
    Get current or upcoming flash sales that are active.
    Only returns flash sales that end in the future.
    """
    now = datetime.now()
    from sqlalchemy.orm import joinedload
    sales = db.query(FlashSale).options(
        joinedload(FlashSale.items)
        .joinedload(FlashSaleItem.sku)
        .joinedload(ProductSKU.product)
        .joinedload(Product.images)
    ).filter(
        FlashSale.is_active == True,
        FlashSale.end_time > now
    ).order_by(FlashSale.start_time.asc()).all()
    
    return sales
