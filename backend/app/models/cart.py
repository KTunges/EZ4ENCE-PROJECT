from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Cart(Base):
    __tablename__ = "carts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String, primary_key=True, index=True)
    cart_id = Column(String, ForeignKey("carts.id"), nullable=False)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    cart = relationship("Cart", back_populates="items")
    sku = relationship("ProductSKU", back_populates="cart_items")
