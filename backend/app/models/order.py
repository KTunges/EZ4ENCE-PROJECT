import enum
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from app.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"          # Chờ xác nhận
    CONFIRMED = "CONFIRMED"      # Đã xác nhận
    SHIPPING = "SHIPPING"        # Đang giao hàng
    DELIVERED = "DELIVERED"      # Đã giao
    CANCELLED = "CANCELLED"      # Đã hủy


class PaymentMethod(str, enum.Enum):
    COD = "COD"                  # Thanh toán khi nhận hàng
    PAYPAL = "PAYPAL"
    VNPAY = "VNPAY"


class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"            # Chưa thanh toán
    PAID = "PAID"                # Đã thanh toán
    REFUNDED = "REFUNDED"        # Đã hoàn tiền


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    address_id = Column(String, ForeignKey("addresses.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.COD, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID, nullable=False)
    payment_transaction_id = Column(String, nullable=True)  # Mã giao dịch trả về từ VNPay/PayPal/Stripe
    total_amount = Column(Float, nullable=False)
    shipping_fee = Column(Float, default=0, nullable=False)
    note = Column(String, nullable=True)  # Ghi chú đơn hàng
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Address", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)  # Lưu lại tên SP lúc đặt hàng (phòng trường hợp SP bị sửa/xóa)
    product_price = Column(Float, nullable=False)   # Lưu lại giá lúc đặt hàng
    quantity = Column(Integer, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
