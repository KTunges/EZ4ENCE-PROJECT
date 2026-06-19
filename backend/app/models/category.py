from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False) # Không unique vì có thể trùng tên ở sub-category
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    parent_id = Column(String, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="category")

    @property
    def product_count(self) -> int:
        return len(self.products) if self.products else 0  # type: ignore
