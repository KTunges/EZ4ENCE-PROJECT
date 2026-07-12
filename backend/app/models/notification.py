import enum
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from app.database import Base


class NotificationType(str, enum.Enum):
    ORDER_NEW = "ORDER_NEW"           # Đơn hàng mới (cho Admin)
    ORDER_STATUS = "ORDER_STATUS"     # Đơn hàng chuyển trạng thái (cho Customer)
    LOW_STOCK = "LOW_STOCK"           # Cảnh báo tồn kho thấp (cho Admin)
    REVIEW_NEW = "REVIEW_NEW"         # Đánh giá mới (cho Admin)
    SYSTEM = "SYSTEM"                 # Thông báo hệ thống


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)  # Null = cho tất cả admin
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.SYSTEM, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    
    # Reference to related entity (e.g., order_id, product_id)
    reference_id = Column(String, nullable=True)
    reference_type = Column(String, nullable=True)  # "order", "product", "review"
    
    # Target audience
    is_admin = Column(Boolean, default=False, nullable=False)  # True = cho admin, False = cho customer
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", backref="notifications")
