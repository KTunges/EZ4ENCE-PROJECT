from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class FlashSale(Base):
    __tablename__ = "flash_sales"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    items = relationship("FlashSaleItem", back_populates="flash_sale", cascade="all, delete-orphan")


class FlashSaleItem(Base):
    __tablename__ = "flash_sale_items"

    id = Column(String, primary_key=True, index=True)
    flash_sale_id = Column(String, ForeignKey("flash_sales.id"), nullable=False)
    product_sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    
    flash_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    sold = Column(Integer, default=0, nullable=False)

    # Relationships
    flash_sale = relationship("FlashSale", back_populates="items")
    sku = relationship("ProductSKU")
