from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid

from app.database import get_db
from app.models.order import Order, OrderStatus, OrderStatusHistory, PaymentStatus, OrderItem
from app.models.user import User, Role
from app.models.product import ProductSKU, Product
from app.routers.auth import get_current_user, get_current_admin, get_current_sales
from pydantic import BaseModel

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])

class OrderStatusUpdate(BaseModel):
    status: str
    description: str = ""

@router.get("", response_model=list)
def get_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_sales),
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
    admin: User = Depends(get_current_sales)
):
    from app.models.product import Product
    order = db.query(Order).filter(Order.id == order_id).options(
        joinedload(Order.user),
        joinedload(Order.shipping_address),
        joinedload(Order.items).joinedload(OrderItem.sku).joinedload(ProductSKU.product).joinedload(Product.images),
        joinedload(Order.items).joinedload(OrderItem.sku).joinedload(ProductSKU.images),
        joinedload(Order.status_history)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return order

@router.put("/{order_id}/status")
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_sales)
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
    
    # Gửi thông báo cho khách hàng khi đơn hàng chuyển trạng thái
    try:
        from app.services.notification_service import notify_customer_order_status
        notify_customer_order_status(db, order.user_id, order.id, order.id, new_status.value)
    except Exception:
        pass  # Không để lỗi notification làm hỏng flow
        
    # Gửi email thông báo
    try:
        from app.services.email_service import send_order_status_email
        if order.user and order.shipping_address:
            # We don't send email if status doesn't change or if it's just PENDING
            if new_status.value in ["CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"] and new_status != old_status:
                background_tasks.add_task(
                    send_order_status_email,
                    order,
                    order.user,
                    order.shipping_address,
                    new_status.value,
                    status_update.description
                )
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to queue order status email: {e}")
    
    return {"message": "Order status updated", "new_status": new_status.value}

# --- Cập nhật trạng thái thanh toán (Admin) ---
class PaymentStatusUpdate(BaseModel):
    payment_status: str  # "PAID" hoặc "UNPAID"

@router.put("/{order_id}/payment-status")
def update_payment_status(
    order_id: str,
    req: PaymentStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_sales)
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
    admin: User = Depends(get_current_sales)
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

from app.schemas.order import AdminOrderCreateRequest
from app.models.address import Address

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_manual_order(
    req: AdminOrderCreateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_sales)
):
    # Check User
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Create Address
    address = Address(
        id=str(uuid.uuid4()),
        user_id=user.id,
        full_name=req.full_name,
        phone=req.phone,
        address_line=req.address_line,
        ward=req.ward,
        district=req.district,
        city=req.city
    )
    db.add(address)
    
    # Calculate Total & Check Stock
    total_amount = 0
    order_items = []
    
    for item in req.items:
        sku = db.query(ProductSKU).filter(ProductSKU.id == item.sku_id).first()
        if not sku:
            raise HTTPException(status_code=404, detail=f"SKU {item.sku_id} not found")
            
        if sku.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for SKU {sku.sku_code}")
            
        price = item.custom_price if item.custom_price is not None else sku.price
        
        # Deduct stock
        sku.stock -= item.quantity
        
        total_amount += price * item.quantity
        
        order_items.append(OrderItem(
            id=str(uuid.uuid4()),
            sku_id=sku.id,
            price_at_purchase=price,
            quantity=item.quantity
        ))
        
    final_total = total_amount + req.shipping_fee - req.discount_amount
    if final_total < 0:
        final_total = 0
        
    # Create Order
    order_id = str(uuid.uuid4())
    order = Order(
        id=order_id,
        user_id=user.id,
        address_id=address.id,
        status=OrderStatus.CONFIRMED, # Auto confirmed for manual orders
        payment_method=req.payment_method,
        payment_status=req.payment_status,
        total_amount=final_total,
        shipping_fee=req.shipping_fee,
        discount_amount=req.discount_amount,
        note=req.note
    )
    
    # Associate items
    for oi in order_items:
        oi.order_id = order_id
        db.add(oi)
        
    db.add(order)
    
    # Add History
    history = OrderStatusHistory(
        id=str(uuid.uuid4()),
        order_id=order_id,
        status=OrderStatus.CONFIRMED,
        description="Đơn hàng được tạo thủ công bởi Admin"
    )
    db.add(history)
    
    db.commit()
    
    return {"message": "Order created successfully", "order_id": order_id}
