from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, func, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    brand_id = Column(String, ForeignKey("brands.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    receipts = relationship("StockReceipt", back_populates="supplier")


class StockReceipt(Base):
    __tablename__ = "stock_receipts"

    id = Column(String, primary_key=True, index=True)
    receipt_code = Column(String, unique=True, index=True, nullable=False) # e.g. IN-20231015-001
    type = Column(String, nullable=False) # 'IN' or 'OUT'
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=True) # Only for 'IN' typically
    total_amount = Column(Float, default=0, nullable=False)
    note = Column(Text, nullable=True)
    created_by = Column(String, nullable=False) # Admin user ID or Name
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    supplier = relationship("Supplier", back_populates="receipts")
    items = relationship("StockReceiptItem", back_populates="receipt", cascade="all, delete-orphan")


class StockReceiptItem(Base):
    __tablename__ = "stock_receipt_items"

    id = Column(String, primary_key=True, index=True)
    receipt_id = Column(String, ForeignKey("stock_receipts.id"), nullable=False)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False) # Import price or value
    total_price = Column(Float, nullable=False)

    receipt = relationship("StockReceipt", back_populates="items")
    sku = relationship("ProductSKU", back_populates="stock_receipt_items")
