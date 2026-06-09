from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    sku = relationship("ProductSKU", back_populates="wishlist_items")
