import uuid
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.product import ProductSKU
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.models.address import Address
from app.routers.auth import get_current_user
from app.schemas.order import OrderCreateRequest, OrderResponse
from app.services.email_service import send_order_confirmation_email

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreateRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Fetch user's cart (nếu không phải là Mua Ngay)
    cart = None
    if not req.buy_now_item:
        cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
        if not cart or not cart.items:
            raise HTTPException(status_code=400, detail="Giỏ hàng đang trống")
        
    # 2. Xử lý Address
    if req.address_id:
        address = db.query(Address).filter(Address.id == req.address_id, Address.user_id == current_user.id).first()
        if not address:
            raise HTTPException(status_code=400, detail="Địa chỉ giao hàng không hợp lệ")
        address_id_to_use = address.id
    else:
        if not req.full_name or not req.phone or not req.address_line or not req.city or not req.district:
            raise HTTPException(status_code=400, detail="Thiếu thông tin địa chỉ giao hàng")
        address = Address(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            full_name=req.full_name,
            phone=req.phone,
            address_line=req.address_line,
            ward=req.ward,
            district=req.district,
            city=req.city,
            province_id=req.province_id,
            district_id=req.district_id,
            ward_code=req.ward_code,
            is_default=False
        )
        db.add(address)
        db.commit() # Để lấy address.id
        db.refresh(address)
        address_id_to_use = address.id
        
    # 3. Tính toán tổng tiền từ giá DB (chống gian lận)
    subtotal = 0
    order_items = []
    
    if req.buy_now_item:
        sku = db.query(ProductSKU).filter(ProductSKU.id == req.buy_now_item.sku_id).first()
        if not sku:
            raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        product = sku.product
        
        # Check stock
        if sku.stock_quantity < req.buy_now_item.quantity:
            raise HTTPException(status_code=400, detail=f"Sản phẩm {product.name} không đủ số lượng trong kho")
            
        price_at_purchase = sku.price
        subtotal += price_at_purchase * req.buy_now_item.quantity
        
        # Trừ kho
        sku.stock_quantity -= req.buy_now_item.quantity
        
        o_item = OrderItem(
            id=str(uuid.uuid4()),
            sku_id=sku.id,
            product_name=product.name,
            sku_code=sku.sku_code,
            price_at_purchase=price_at_purchase,
            quantity=req.buy_now_item.quantity
        )
        order_items.append(o_item)
    elif cart:
        for cart_item in cart.items:
            if req.selected_cart_item_ids and cart_item.id not in req.selected_cart_item_ids:
                continue
                
            sku = cart_item.sku
            product = sku.product
            
            # Check stock
            if sku.stock_quantity < cart_item.quantity:
                raise HTTPException(status_code=400, detail=f"Sản phẩm {product.name} không đủ số lượng trong kho")
                
            price_at_purchase = sku.price
            subtotal += price_at_purchase * cart_item.quantity
            
            # Trừ kho
            sku.stock_quantity -= cart_item.quantity
            
            o_item = OrderItem(
                id=str(uuid.uuid4()),
                sku_id=sku.id,
                product_name=product.name,
                sku_code=sku.sku_code,
                price_at_purchase=price_at_purchase,
                quantity=cart_item.quantity
            )
            order_items.append(o_item)
            
        if not order_items:
            raise HTTPException(status_code=400, detail="Không có sản phẩm nào được chọn để thanh toán")

    total_amount = subtotal + (req.shipping_fee or 0)
    shipping_fee = req.shipping_fee or 0
    discount_amount = 0
    
    # Calculate Promotion
    if req.promotion_id:
        from app.models.marketing import Promotion
        from datetime import datetime, timezone
        promotion = db.query(Promotion).filter(Promotion.id == req.promotion_id, Promotion.is_active == True).first()
        if promotion:
            now = datetime.now(timezone.utc)
            if (not promotion.expiration_date) or (promotion.expiration_date >= now):
                if subtotal >= promotion.min_order_value:
                    if promotion.discount_percent:
                        discount_amount = subtotal * (promotion.discount_percent / 100)
                    elif promotion.discount_amount:
                        discount_amount = promotion.discount_amount
                    if discount_amount > subtotal:
                        discount_amount = subtotal
                        
    final_total = total_amount - discount_amount
    
    # 4. Create Order
    # Tự động sinh mã giao dịch cho COD
    txn_id = None
    if req.payment_method == PaymentMethod.COD:
        txn_id = f"COD-{uuid.uuid4().hex[:8].upper()}"
        
    new_order = Order(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        address_id=address_id_to_use,
        promotion_id=req.promotion_id,
        status=OrderStatus.PENDING,
        payment_method=req.payment_method,
        payment_status=PaymentStatus.UNPAID,
        payment_transaction_id=txn_id,
        total_amount=final_total,
        shipping_fee=shipping_fee,
        shipping_provider=req.shipping_provider,
        discount_amount=discount_amount,
        note=req.note
    )
    db.add(new_order)
    
    from app.models.order import OrderStatusHistory
    status_history = OrderStatusHistory(
        id=str(uuid.uuid4()),
        order_id=new_order.id,
        status=OrderStatus.PENDING,
        description="Đơn hàng đã được tạo thành công"
    )
    db.add(status_history)
    
    # Gắn OrderItems vào Order
    for item in order_items:
        item.order_id = new_order.id
        db.add(item)
        
    # 5. Clear Cart (chỉ khi không phải mua ngay)
    if not req.buy_now_item and cart:
        for item in cart.items:
            if req.selected_cart_item_ids:
                if item.id in req.selected_cart_item_ids:
                    db.delete(item)
            else:
                db.delete(item)

    db.commit()
    db.refresh(new_order)
    
    # 6. Tạo thông báo cho Admin khi có đơn hàng mới
    try:
        from app.services.notification_service import notify_admins_new_order
        notify_admins_new_order(db, str(new_order.order_code), str(new_order.id), str(current_user.full_name or current_user.username or "Khách hàng"), final_total)
    except Exception:
        pass  # Không để lỗi notification làm hỏng flow đặt hàng
    
    # Send email for COD orders immediately
    if req.payment_method == PaymentMethod.COD:
        # Get address details since we might have just created it
        order_address = db.query(Address).filter(Address.id == address_id_to_use).first()
        if order_address:
            try:
                background_tasks.add_task(send_order_confirmation_email, new_order, current_user, order_address)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(f"Failed to add email task: {e}")
    
    # Prepare response
    response_items = []
    for item in order_items:
        sku = db.query(ProductSKU).filter(ProductSKU.id == item.sku_id).first()
        img_url = None
        if sku:
            product = sku.product
            img_url = sku.images[0].url if sku.images else (product.images[0].url if product.images else None)
            
        response_items.append({
            "id": item.id,
            "order_id": item.order_id,
            "sku_id": item.sku_id,
            "product_name": item.product_name,
            "sku_code": item.sku_code,
            "price_at_purchase": item.price_at_purchase,
            "quantity": item.quantity,
            "image_url": img_url
        })
        
    return {
        **new_order.__dict__,
        "items": response_items
    }

from typing import List
from sqlalchemy.orm import selectinload, joinedload

@router.get("", response_model=List[OrderResponse])
def get_user_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).options(
        selectinload(Order.items).joinedload(OrderItem.sku).joinedload(ProductSKU.product).selectinload(Product.images),
        selectinload(Order.items).joinedload(OrderItem.sku).selectinload(ProductSKU.images)
    ).order_by(Order.created_at.desc()).all()
    
    # add image_url to items
    for order in orders:
        for item in order.items:
            sku = item.sku
            if sku:
                product = sku.product
                item.image_url = sku.images[0].url if sku.images else (product.images[0].url if product and product.images else None)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(order_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    for item in order.items:
        sku = db.query(ProductSKU).filter(ProductSKU.id == item.sku_id).first()
        if sku:
            product = sku.product
            item.image_url = sku.images[0].url if sku.images else (product.images[0].url if product.images else None)
            
    return order
