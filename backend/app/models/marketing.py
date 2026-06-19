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
    discount_percent = Column(Float, nullable=True)
    discount_amount = Column(Float, nullable=True)
    min_order_value = Column(Float, default=0, nullable=False)
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    orders = relationship("Order", back_populates="promotion")

