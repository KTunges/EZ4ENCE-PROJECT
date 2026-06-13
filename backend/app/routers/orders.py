import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.product import ProductSKU
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.models.address import Address
from app.routers.auth import get_current_user
from app.schemas.order import OrderCreateRequest, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Fetch user's cart
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
    
    for cart_item in cart.items:
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
        
    total_amount = subtotal + (req.shipping_fee or 0)
    shipping_fee = req.shipping_fee or 0
    discount_amount = 0
    final_total = total_amount - discount_amount
    
    # 4. Create Order
    new_order = Order(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        address_id=address_id_to_use,
        promotion_id=req.promotion_id,
        status=OrderStatus.PENDING,
        payment_method=req.payment_method,
        payment_status=PaymentStatus.UNPAID,
        total_amount=final_total,
        shipping_fee=shipping_fee,
        shipping_provider=req.shipping_provider,
        discount_amount=discount_amount,
        note=req.note
    )
    db.add(new_order)
    
    # Gắn OrderItems vào Order
    for item in order_items:
        item.order_id = new_order.id
        db.add(item)
        
    # 5. Clear Cart
    for item in cart.items:
        db.delete(item)
        
    db.commit()
    db.refresh(new_order)
    
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
