from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    brand_id = Column(String, ForeignKey("brands.id"), nullable=True)
    
    # JSONB for specifications (e.g., {"socket": "LGA 1700", "cores": 12})
    specifications = Column(JSON, default={}, nullable=False)
    
    is_published = Column(Boolean, default=True, nullable=False)
    sold_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    skus = relationship("ProductSKU", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.is_primary.desc()")

    @property
    def review_count(self) -> int:
        count = 0
        for sku in self.skus:
            count += len(sku.reviews)
        return count

    @property
    def rating(self) -> float:
        total_rating = 0
        count = 0
        for sku in self.skus:
            for review in sku.reviews:
                total_rating += review.rating
                count += 1
        
        # Mặc định 5.0 sao nếu chưa có đánh giá
        return round(total_rating / count, 1) if count > 0 else 5.0


class ProductSKU(Base):
    __tablename__ = "product_skus"
    
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    sku_code = Column(String, unique=True, index=True, nullable=False)
    
    # Pricing & Inventory
    price = Column(Float, nullable=False)
    promotional_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    
    # JSONB for variant specific attributes (e.g., {"color": "White", "capacity": "32GB"})
    attributes = Column(JSON, default={}, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    product = relationship("Product", back_populates="skus")
    images = relationship("SkuImage", back_populates="sku", cascade="all, delete-orphan")
    
    # These interact with the transaction/user side
    cart_items = relationship("CartItem", back_populates="sku")
    order_items = relationship("OrderItem", back_populates="sku")
    reviews = relationship("Review", back_populates="sku", cascade="all, delete-orphan")
    stock_receipt_items = relationship("StockReceiptItem", back_populates="sku", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="sku", cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)

    product = relationship("Product", back_populates="images")


class SkuImage(Base):
    __tablename__ = "sku_images"
    
    id = Column(String, primary_key=True, index=True)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)

    sku = relationship("ProductSKU", back_populates="images")
