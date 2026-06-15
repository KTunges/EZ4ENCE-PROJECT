from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User, Role
from app.schemas.user import AdminUserResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])

@router.get("", response_model=List[AdminUserResponse])
def get_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Lấy danh sách tất cả tài khoản khách hàng (Role = USER).
    Tính toán thêm tổng số đơn hàng và tổng chi tiêu.
    """
    users = db.query(User).filter(User.role == Role.USER).all()
    
    result = []
    for user in users:
        # Build user dictionary and calculate dynamic fields
        user_dict = {
            "id": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "phone": user.phone,
            "role": user.role,
            "is_active": user.is_active,
            "createdAt": user.created_at,
            "updatedAt": user.updated_at,
            "total_orders": len(user.orders) if user.orders else 0,
            "total_spent": sum([order.total_amount for order in user.orders]) if user.orders else 0
        }
        result.append(user_dict)
        
    return result

@router.put("/{user_id}/toggle-active")
def toggle_user_active(user_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Khóa hoặc Mở khóa tài khoản khách hàng.
    """
    user = db.query(User).filter(User.id == user_id, User.role == Role.USER).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_active = not user.is_active
    db.commit()
    
    status_str = "Hoạt động" if user.is_active else "Bị khóa"
    return {"message": f"Tài khoản đã chuyển sang trạng thái: {status_str}", "is_active": user.is_active}

@router.get("/{user_id}")
def get_user_details(user_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Lấy thông tin chi tiết của khách hàng bao gồm lịch sử đơn hàng và đánh giá.
    """
    user = db.query(User).filter(User.id == user_id, User.role == Role.USER).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    orders = []
    for order in user.orders:
        orders.append({
            "id": order.id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at
        })
        
    reviews = []
    for review in user.reviews:
        reviews.append({
            "id": review.id,
            "product_name": review.sku.product.name if review.sku and review.sku.product else "N/A",
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        })

    addresses = []
    for address in user.addresses:
        addresses.append({
            "id": address.id,
            "full_name": address.full_name,
            "phone": address.phone,
            "address_line": address.address_line,
            "ward": address.ward,
            "district": address.district,
            "city": address.city,
            "is_default": address.is_default
        })

    return {
        "id": user.id,
        "email": user.email,
        "fullName": user.full_name,
        "phone": user.phone,
        "role": user.role,
        "is_active": user.is_active,
        "createdAt": user.created_at,
        "orders": sorted(orders, key=lambda x: x["created_at"], reverse=True),
        "reviews": sorted(reviews, key=lambda x: x["created_at"], reverse=True),
        "addresses": addresses,
        "total_spent": sum([o["total_amount"] for o in orders])
    }
