from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.routers.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ============== CUSTOMER ENDPOINTS ==============

@router.get("")
def get_my_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách thông báo của khách hàng hiện tại."""
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_admin == False
    ).order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()

    return [{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "type": n.type.value,
        "is_read": n.is_read,
        "reference_id": n.reference_id,
        "reference_type": n.reference_type,
        "created_at": n.created_at
    } for n in notifications]


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Đếm số thông báo chưa đọc của khách hàng."""
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_admin == False,
        Notification.is_read == False
    ).count()
    return {"unread_count": count}


@router.patch("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Đánh dấu một thông báo là đã đọc."""
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.patch("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Đánh dấu tất cả thông báo của khách hàng là đã đọc."""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_admin == False,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


# ============== ADMIN ENDPOINTS ==============

@router.get("/admin")
def get_admin_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Lấy danh sách thông báo dành cho Admin."""
    notifications = db.query(Notification).filter(
        Notification.is_admin == True
    ).order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()

    return [{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "type": n.type.value,
        "is_read": n.is_read,
        "reference_id": n.reference_id,
        "reference_type": n.reference_type,
        "created_at": n.created_at
    } for n in notifications]


@router.get("/admin/unread-count")
def get_admin_unread_count(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Đếm số thông báo admin chưa đọc."""
    count = db.query(Notification).filter(
        Notification.is_admin == True,
        Notification.is_read == False
    ).count()
    return {"unread_count": count}


@router.patch("/admin/{notification_id}/read")
def admin_mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Admin đánh dấu thông báo đã đọc."""
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.is_admin == True
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.patch("/admin/read-all")
def admin_mark_all_as_read(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Admin đánh dấu tất cả thông báo đã đọc."""
    db.query(Notification).filter(
        Notification.is_admin == True,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All admin notifications marked as read"}
