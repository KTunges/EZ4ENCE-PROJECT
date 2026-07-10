from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid

from app.database import get_db
from app.models.order import Order, OrderStatus, OrderStatusHistory, PaymentStatus, OrderItem
from app.models.user import User, Role
from app.models.product import ProductSKU, Product
from app.routers.auth import get_current_user, get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])

class OrderStatusUpdate(BaseModel):
    status: str
    description: str = ""

@router.get("", response_model=list)
def get_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    orders = db.query(Order).options(
        joinedload(Order.user)
    ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    # Return dict for simplicity in admin view
    return [{
        "id": o.id,
        "user_id": o.user_id,
        "customer_name": o.user.full_name if o.user else "Khách Vãng Lai",
        "total_amount": o.total_amount,
        "status": o.status.value,
        "payment_status": o.payment_status.value,
        "created_at": o.created_at
    } for o in orders]

@router.get("/{order_id}")
def get_order_detail(
    order_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).options(
        joinedload(Order.user),
        joinedload(Order.shipping_address),
        joinedload(Order.items).joinedload(OrderItem.sku).joinedload(ProductSKU.product),
        joinedload(Order.status_history)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return order

@router.put("/{order_id}/status")
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    order = db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.sku)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    try:
        new_status = OrderStatus(status_update.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    old_status = order.status
    order.status = new_status
    
    # Update product sold_count based on DELIVERED status transitions
    if new_status == OrderStatus.DELIVERED and old_status != OrderStatus.DELIVERED:
        for item in order.items:
            if item.sku and item.sku.product_id:
                product = db.query(Product).filter(Product.id == item.sku.product_id).first()
                if product:
                    product.sold_count += item.quantity
        
        # COD: Khi giao hàng thành công → tự động đánh dấu đã thanh toán
        from app.models.order import PaymentMethod
        if order.payment_method == PaymentMethod.COD:
            order.payment_status = PaymentStatus.PAID
            
    elif old_status == OrderStatus.DELIVERED and new_status != OrderStatus.DELIVERED:
        for item in order.items:
            if item.sku and item.sku.product_id:
                product = db.query(Product).filter(Product.id == item.sku.product_id).first()
                if product:
                    product.sold_count = max(0, product.sold_count - item.quantity)
        
        # COD: Nếu hủy trạng thái "Đã giao" → trả về "Chưa thanh toán"
        from app.models.order import PaymentMethod
        if order.payment_method == PaymentMethod.COD:
            order.payment_status = PaymentStatus.UNPAID
    
    history = OrderStatusHistory(
        id=str(uuid.uuid4()),
        order_id=order.id,
        status=new_status,
        description=status_update.description or f"Trạng thái cập nhật thành {new_status.value} bởi Admin"
    )
    db.add(history)
    db.commit()
    
    return {"message": "Order status updated", "new_status": new_status.value}

# --- Cập nhật trạng thái thanh toán (Admin) ---
class PaymentStatusUpdate(BaseModel):
    payment_status: str  # "PAID" hoặc "UNPAID"

@router.put("/{order_id}/payment-status")
def update_payment_status(
    order_id: str,
    req: PaymentStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        new_payment_status = PaymentStatus(req.payment_status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payment status. Use 'PAID' or 'UNPAID'")
    
    order.payment_status = new_payment_status
    
    history = OrderStatusHistory(
        id=str(uuid.uuid4()),
        order_id=order.id,
        status=order.status,
        description=f"Trạng thái thanh toán cập nhật thành {new_payment_status.value} bởi Admin"
    )
    db.add(history)
    db.commit()
    
    return {"message": "Payment status updated", "new_payment_status": new_payment_status.value}

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Xóa đơn hàng (Thực tế nên dùng cờ is_deleted hoặc soft delete, nhưng ở đây xóa cứng)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    db.delete(order)
    db.commit()
    return None
