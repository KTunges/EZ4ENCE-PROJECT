import uuid
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType


def create_notification(
    db: Session,
    title: str,
    message: str,
    ntype: NotificationType,
    is_admin: bool = False,
    user_id: str = None,
    reference_id: str = None,
    reference_type: str = None
):
    """Tạo một notification mới và lưu vào database."""
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        message=message,
        type=ntype,
        is_admin=is_admin,
        reference_id=reference_id,
        reference_type=reference_type
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def notify_admins_new_order(db: Session, order_code: str, order_id: str, customer_name: str, total: float):
    """Thông báo cho Admin khi có đơn hàng mới."""
    formatted_total = f"{total:,.0f}đ"
    create_notification(
        db=db,
        title="Đơn hàng mới",
        message=f"Khách hàng {customer_name} vừa đặt đơn #{order_code[-8:].upper()} - {formatted_total}",
        ntype=NotificationType.ORDER_NEW,
        is_admin=True,
        reference_id=order_id,
        reference_type="order"
    )


def notify_customer_order_status(db: Session, user_id: str, order_id: str, order_code: str, new_status: str):
    """Thông báo cho khách hàng khi đơn hàng chuyển trạng thái."""
    status_messages = {
        "CONFIRMED": ("Đơn hàng đã được xác nhận", f"Đơn hàng #{order_code[-8:].upper()} của bạn đã được xác nhận và đang chuẩn bị."),
        "SHIPPING": ("Đơn hàng đang được giao", f"Đơn hàng #{order_code[-8:].upper()} đang trên đường giao đến bạn."),
        "DELIVERED": ("Đơn hàng giao thành công", f"Đơn hàng #{order_code[-8:].upper()} đã được giao thành công. Cảm ơn bạn đã mua hàng!"),
        "CANCELLED": ("Đơn hàng đã bị hủy", f"Đơn hàng #{order_code[-8:].upper()} đã bị hủy.")
    }
    
    title, message = status_messages.get(new_status, ("Cập nhật đơn hàng", f"Đơn hàng #{order_code[-8:].upper()} có cập nhật mới."))
    
    create_notification(
        db=db,
        title=title,
        message=message,
        ntype=NotificationType.ORDER_STATUS,
        is_admin=False,
        user_id=user_id,
        reference_id=order_id,
        reference_type="order"
    )


def notify_admins_low_stock(db: Session, product_name: str, sku_code: str, stock: int, product_id: str):
    """Thông báo cho Admin khi sản phẩm sắp hết hàng."""
    create_notification(
        db=db,
        title="Cảnh báo tồn kho",
        message=f"Sản phẩm \"{product_name}\" ({sku_code}) chỉ còn {stock} sản phẩm.",
        ntype=NotificationType.LOW_STOCK,
        is_admin=True,
        reference_id=product_id,
        reference_type="product"
    )


def notify_admins_new_review(db: Session, customer_name: str, product_name: str, rating: int, review_id: str):
    """Thông báo cho Admin khi có đánh giá mới."""
    stars = "⭐" * rating
    create_notification(
        db=db,
        title="Đánh giá mới",
        message=f"{customer_name} đã đánh giá {stars} cho sản phẩm \"{product_name}\"",
        ntype=NotificationType.REVIEW_NEW,
        is_admin=True,
        reference_id=review_id,
        reference_type="review"
    )
