from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models.inventory import Supplier, StockReceipt, StockReceiptItem
from app.models.product import ProductSKU, Product
from app.schemas.inventory import (
    SupplierResponse, SupplierCreate, SupplierUpdate,
    StockReceiptResponse, StockReceiptCreate,
    InventorySKUResponse
)
from app.routers.auth import get_current_admin
from app.models.user import User

router = APIRouter(
    prefix="/admin/inventory",
    tags=["Admin Inventory"],
    dependencies=[Depends(get_current_admin)]
)

# =======================
# SUPPLIERS
# =======================

@router.get("/suppliers", response_model=List[SupplierResponse])
def get_all_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).order_by(Supplier.created_at.desc()).all()

@router.post("/suppliers", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    new_sup = Supplier(
        id=str(uuid.uuid4()),
        name=supplier_in.name,
        contact_name=supplier_in.contact_name,
        phone=supplier_in.phone,
        email=supplier_in.email,
        address=supplier_in.address,
        is_active=supplier_in.is_active
    )
    db.add(new_sup)
    db.commit()
    db.refresh(new_sup)
    return new_sup

@router.put("/suppliers/{sup_id}", response_model=SupplierResponse)
def update_supplier(sup_id: str, sup_in: SupplierUpdate, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.id == sup_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Nhà cung cấp không tồn tại")
    
    sup.name = sup_in.name
    sup.contact_name = sup_in.contact_name
    sup.phone = sup_in.phone
    sup.email = sup_in.email
    sup.address = sup_in.address
    sup.is_active = sup_in.is_active
    
    db.commit()
    db.refresh(sup)
    return sup

@router.delete("/suppliers/{sup_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(sup_id: str, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.id == sup_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Nhà cung cấp không tồn tại")
    db.delete(sup)
    db.commit()
    return None


# =======================
# INVENTORY OVERVIEW
# =======================

@router.get("/skus", response_model=List[InventorySKUResponse])
def get_inventory_skus(db: Session = Depends(get_db)):
    skus = db.query(ProductSKU).join(Product).all()
    res = []
    for sku in skus:
        # Get first image of product if any
        img_url = None
        if sku.product.images:
            img_url = sku.product.images[0].image_url
            
        res.append(InventorySKUResponse(
            sku_id=sku.id,
            product_name=sku.product.name,
            sku_name=f"{sku.color} - {sku.ram} - {sku.storage}",
            stock=sku.stock,
            price=sku.price,
            image_url=img_url
        ))
    return res


# =======================
# STOCK RECEIPTS (IN/OUT)
# =======================

@router.get("/receipts", response_model=List[StockReceiptResponse])
def get_all_receipts(db: Session = Depends(get_db)):
    return db.query(StockReceipt).order_by(StockReceipt.created_at.desc()).all()

@router.post("/receipts", response_model=StockReceiptResponse, status_code=status.HTTP_201_CREATED)
def create_receipt(receipt_in: StockReceiptCreate, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Generate receipt code
    date_str = datetime.now().strftime("%Y%m%d")
    count = db.query(StockReceipt).filter(StockReceipt.created_at >= datetime.now().replace(hour=0, minute=0, second=0)).count()
    code = f"{receipt_in.type}-{date_str}-{(count + 1):03d}"

    total_amount = sum([item.quantity * item.unit_price for item in receipt_in.items])

    new_receipt = StockReceipt(
        id=str(uuid.uuid4()),
        receipt_code=code,
        type=receipt_in.type,
        supplier_id=receipt_in.supplier_id if receipt_in.type == 'IN' else None,
        total_amount=total_amount,
        note=receipt_in.note,
        created_by=current_admin.full_name
    )
    db.add(new_receipt)
    db.flush()

    for item_in in receipt_in.items:
        # Update SKU stock
        sku = db.query(ProductSKU).filter(ProductSKU.id == item_in.sku_id).first()
        if not sku:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"SKU {item_in.sku_id} không tồn tại")
        
        if receipt_in.type == 'IN':
            sku.stock += item_in.quantity
        elif receipt_in.type == 'OUT':
            if sku.stock < item_in.quantity:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Số lượng tồn kho không đủ để xuất cho SKU {item_in.sku_id}")
            sku.stock -= item_in.quantity

        receipt_item = StockReceiptItem(
            id=str(uuid.uuid4()),
            receipt_id=new_receipt.id,
            sku_id=item_in.sku_id,
            quantity=item_in.quantity,
            unit_price=item_in.unit_price,
            total_price=item_in.quantity * item_in.unit_price
        )
        db.add(receipt_item)

    db.commit()
    db.refresh(new_receipt)
    return new_receipt
