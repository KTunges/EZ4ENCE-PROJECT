from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from typing import Optional
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    sku_id = Column(String, ForeignKey("product_skus.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 sao
    comment = Column(String, nullable=True)
    admin_reply = Column(String, nullable=True)
    is_hidden = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="reviews")
    sku = relationship("ProductSKU", back_populates="reviews")
    images = relationship("ReviewImage", back_populates="review", cascade="all, delete-orphan")
    likes = relationship("ReviewLike", back_populates="review", cascade="all, delete-orphan")

    @property
    def user_name(self) -> str:
        return self.user.full_name if self.user else "Khách hàng"

    @property
    def user_avatar(self) -> Optional[str]:
        return self.user.avatar if self.user and self.user.avatar else None

    @property
    def helpful_count(self) -> int:
        return len(self.likes) if self.likes else 0  # type: ignore


class ReviewImage(Base):
    __tablename__ = "review_images"
    
    id = Column(String, primary_key=True, index=True)
    review_id = Column(String, ForeignKey("reviews.id"), nullable=False)
    url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    review = relationship("Review", back_populates="images")


class ReviewLike(Base):
    __tablename__ = "review_likes"

    id = Column(String, primary_key=True, index=True)
    review_id = Column(String, ForeignKey("reviews.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    review = relationship("Review", back_populates="likes")
    user = relationship("User")
