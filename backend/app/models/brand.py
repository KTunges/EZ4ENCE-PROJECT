from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Brand(Base):
    __tablename__ = "brands"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    products = relationship("Product", back_populates="brand")

    @property
    def product_count(self) -> int:
        return len(self.products) if self.products else 0  # type: ignore
