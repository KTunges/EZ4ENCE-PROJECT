from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import List
from datetime import datetime
import uuid

from app.database import get_db
from app.models.flash_sale import FlashSale, FlashSaleItem
from app.schemas.flash_sale import FlashSaleResponse, FlashSaleCreate, FlashSaleUpdate, FlashSaleItemResponse
from app.routers.auth import get_current_admin

router = APIRouter(
    prefix="/admin/flash-sales",
    tags=["admin_flash_sales"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("", response_model=List[FlashSaleResponse])
def get_admin_flash_sales(db: Session = Depends(get_db)):
    sales = db.query(FlashSale).order_by(FlashSale.start_time.desc()).all()
    return sales

@router.post("", response_model=FlashSaleResponse, status_code=status.HTTP_201_CREATED)
def create_flash_sale(sale_in: FlashSaleCreate, db: Session = Depends(get_db)):
    if sale_in.start_time >= sale_in.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")
        
    db_sale = FlashSale(
        id=str(uuid.uuid4()),
        name=sale_in.name,
        start_time=sale_in.start_time,
        end_time=sale_in.end_time,
        is_active=sale_in.is_active
    )
    db.add(db_sale)
    db.flush()
    
    for item in (sale_in.items or []):
        db_item = FlashSaleItem(
            id=str(uuid.uuid4()),
            flash_sale_id=db_sale.id,
            product_sku_id=item.product_sku_id,
            flash_price=item.flash_price,
            quantity=item.quantity,
            sold=0
        )
        db.add(db_item)
        
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.put("/{sale_id}", response_model=FlashSaleResponse)
def update_flash_sale(sale_id: str, sale_in: FlashSaleUpdate, db: Session = Depends(get_db)):
    db_sale = db.query(FlashSale).filter(FlashSale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Flash sale not found")
        
    update_data = sale_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_sale, key, value)
        
    if db_sale.start_time >= db_sale.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")
        
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/{sale_id}")
def delete_flash_sale(sale_id: str, db: Session = Depends(get_db)):
    db_sale = db.query(FlashSale).filter(FlashSale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Flash sale not found")
        
    db.delete(db_sale)
    db.commit()
    return {"message": "Flash sale deleted"}

# --- Manage items inside a flash sale ---
from app.schemas.flash_sale import FlashSaleItemCreate

@router.post("/{sale_id}/items", response_model=FlashSaleResponse)
def add_item_to_flash_sale(sale_id: str, item_in: FlashSaleItemCreate, db: Session = Depends(get_db)):
    db_sale = db.query(FlashSale).filter(FlashSale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Flash sale not found")
        
    # Check if SKU already in this sale
    existing = db.query(FlashSaleItem).filter(
        FlashSaleItem.flash_sale_id == sale_id,
        FlashSaleItem.product_sku_id == item_in.product_sku_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product SKU already in this flash sale")
        
    db_item = FlashSaleItem(
        id=str(uuid.uuid4()),
        flash_sale_id=sale_id,
        product_sku_id=item_in.product_sku_id,
        flash_price=item_in.flash_price,
        quantity=item_in.quantity,
        sold=0
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/{sale_id}/items/{item_id}")
def remove_item_from_flash_sale(sale_id: str, item_id: str, db: Session = Depends(get_db)):
    db_item = db.query(FlashSaleItem).filter(FlashSaleItem.id == item_id, FlashSaleItem.flash_sale_id == sale_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(db_item)
    db.commit()
    return {"message": "Item removed"}
