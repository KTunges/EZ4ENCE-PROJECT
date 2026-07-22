import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.cart import Cart, CartItem
from app.models.product import ProductSKU
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.cart import CartResponse, CartItemAddRequest, CartItemUpdateRequest

router = APIRouter(prefix="/cart", tags=["Cart"])

def get_or_create_cart(db: Session, user_id: str) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(id=str(uuid.uuid4()), user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.get("", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = get_or_create_cart(db, str(current_user.id))
    
    # Tính tổng
    total_amount = 0
    total_items = 0
    
    # Nạp dữ liệu items
    items = db.query(CartItem).options(
        joinedload(CartItem.sku).joinedload(ProductSKU.product).joinedload(Product.images),
        joinedload(CartItem.sku).joinedload(ProductSKU.images)
    ).filter(CartItem.cart_id == cart.id).all()
    
    # Pre-fetch flash sales for all SKUs in cart
    from app.models.flash_sale import FlashSale, FlashSaleItem
    from app.models.product import Product
    from datetime import datetime
    now = datetime.now()
    sku_ids = [item.sku_id for item in items]
    active_flash_sales = {}
    if sku_ids:
        flash_sales = db.query(FlashSaleItem).join(FlashSale).filter(
            FlashSale.is_active == True,
            FlashSale.start_time <= now,
            FlashSale.end_time > now,
            FlashSaleItem.product_sku_id.in_(sku_ids),
            FlashSaleItem.sold < FlashSaleItem.quantity
        ).all()
        active_flash_sales = {fs.product_sku_id: fs.flash_price for fs in flash_sales}
    
    response_items = []
    for item in items:
        sku = item.sku
        product = sku.product
        
        if sku.id in active_flash_sales:
            current_price = active_flash_sales[sku.id]
        elif sku.promotional_price and sku.promotional_price < sku.price:
            current_price = sku.promotional_price
        else:
            current_price = sku.price
        
        total_amount += current_price * item.quantity
        total_items += item.quantity
        
        # Bóc tách thông tin sản phẩm
        img_url = sku.images[0].url if sku.images else (product.images[0].url if product.images else None)
        
        response_items.append({
            "id": item.id,
            "cart_id": item.cart_id,
            "sku_id": item.sku_id,
            "quantity": item.quantity,
            "created_at": item.created_at,
            "product_id": product.id,
            "product_name": product.name,
            "product_slug": product.slug,
            "sku_code": sku.sku_code,
            "price": current_price,
            "original_price": sku.price,
            "promotional_price": sku.promotional_price,
            "stock_quantity": sku.stock_quantity,
            "image_url": img_url
        })
        
    return {
        "id": cart.id,
        "user_id": cart.user_id,
        "created_at": cart.created_at,
        "updated_at": cart.updated_at,
        "items": response_items,
        "total_amount": total_amount,
        "total_items": total_items
    }

@router.post("/items")
def add_item_to_cart(req: CartItemAddRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = get_or_create_cart(db, str(current_user.id))
    
    # Kiểm tra tồn tại sku
    sku = db.query(ProductSKU).filter(ProductSKU.id == req.sku_id).first()
    if not sku:
        raise HTTPException(status_code=404, detail="SKU không tồn tại")
        
    if sku.stock_quantity < req.quantity:
        raise HTTPException(status_code=400, detail="Không đủ hàng trong kho")
        
    # Check if item already exists
    existing_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.sku_id == req.sku_id).first()
    
    if existing_item:
        new_quantity = existing_item.quantity + req.quantity
        if sku.stock_quantity < new_quantity:
            raise HTTPException(status_code=400, detail="Không đủ hàng trong kho")
        existing_item.quantity = new_quantity
    else:
        new_item = CartItem(
            id=str(uuid.uuid4()),
            cart_id=cart.id,
            sku_id=req.sku_id,
            quantity=req.quantity
        )
        db.add(new_item)
        
    db.commit()
    return {"success": True, "message": "Đã thêm vào giỏ hàng"}

@router.put("/items/{item_id}")
def update_cart_item(item_id: str, req: CartItemUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = get_or_create_cart(db, str(current_user.id))
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm trong giỏ")
        
    if req.quantity <= 0:
        db.delete(item)
    else:
        # Check stock
        if item.sku.stock_quantity < req.quantity:
            raise HTTPException(status_code=400, detail="Không đủ hàng trong kho")
        item.quantity = req.quantity
        
    db.commit()
    return {"success": True}

@router.delete("/items/{item_id}")
def remove_cart_item(item_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = get_or_create_cart(db, str(current_user.id))
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm trong giỏ")
        
    db.delete(item)
    db.commit()
    return {"success": True}
