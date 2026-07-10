import enum
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from app.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    SHIPPING = "SHIPPING"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class PaymentMethod(str, enum.Enum):
    COD = "COD"
    PAYPAL = "PAYPAL"
    VNPAY = "VNPAY"
    MOMO = "MOMO"


class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"
    REFUNDED = "REFUNDED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    address_id = Column(String, ForeignKey("addresses.id"), nullable=False)
    promotion_id = Column(String, ForeignKey("promotions.id"), nullable=True) # Áp dụng mã giảm giá
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.COD, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID, nullable=False)
    payment_transaction_id = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    shipping_fee = Column(Float, default=0, nullable=False)
    shipping_provider = Column(String, nullable=True)
    discount_amount = Column(Float, default=0, nullable=False) # Tiền được giảm
    note = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Address", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    promotion = relationship("Promotion", back_populates="orders")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan", order_by="OrderStatusHistory.created_at.asc()")

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    status = Column(Enum(OrderStatus), nullable=False)
    description = Column(String, nullable=True) # VD: "Đơn hàng đã được tạo", "Đã thanh toán qua VNPay"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="status_history")



class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    product_name = Column(String, nullable=False)
    sku_code = Column(String, nullable=False) # Lưu lại SKU lúc mua
    price_at_purchase = Column(Float, nullable=False) # Giá lúc mua
    quantity = Column(Integer, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    sku = relationship("ProductSKU", back_populates="order_items")
