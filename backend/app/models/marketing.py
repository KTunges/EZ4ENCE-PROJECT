from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, func
from sqlalchemy.orm import relationship
from app.database import Base


class Banner(Base):
    __tablename__ = "banners"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    link_url = Column(String, nullable=True)
    position = Column(String, nullable=False) # e.g., 'hero_slider', 'sidebar_left'
    is_active = Column(Boolean, default=True, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, default="product", nullable=False) # 'product' | 'shipping'
    is_public = Column(Boolean, default=True, nullable=False) # Hiện ở pop-up hay không
    discount_percent = Column(Float, nullable=True)
    discount_amount = Column(Float, nullable=True)
    max_discount_amount = Column(Float, nullable=True)  # Giảm tối đa (VD: giảm 10% nhưng tối đa 10.000đ)
    min_order_value = Column(Float, default=0, nullable=False)
    usage_limit = Column(Integer, nullable=True)  # Giới hạn tổng lượt sử dụng (null = không giới hạn)
    usage_count = Column(Integer, default=0, nullable=False)  # Số lần đã sử dụng
    usage_limit_per_user = Column(Integer, default=1, nullable=False)  # Mỗi user dùng tối đa bao nhiêu lần
    start_date = Column(DateTime(timezone=True), nullable=True)  # Ngày bắt đầu áp dụng
    expiration_date = Column(DateTime(timezone=True), nullable=True)  # Ngày hết hạn
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    orders = relationship("Order", foreign_keys="[Order.promotion_id]", back_populates="promotion")


class UserSavedPromotion(Base):
    __tablename__ = "user_saved_promotions"

    user_id = Column(String, index=True, primary_key=True)
    promotion_id = Column(String, index=True, primary_key=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
