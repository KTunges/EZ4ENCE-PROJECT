from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class CompatibilityOverride(Base):
    __tablename__ = "compatibility_overrides"

    id = Column(String, primary_key=True, index=True)
    product_id_1 = Column(String, ForeignKey("products.id"), nullable=False)
    product_id_2 = Column(String, ForeignKey("products.id"), nullable=False)
    is_compatible = Column(Boolean, nullable=False) # True = ép tương thích, False = ép KHÔNG tương thích
    note = Column(String, nullable=True) # Lý do (VD: "Cần update BIOS version 1.2")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Note: Complex relationships to Product model can be added if needed to fetch the related products easily, 
    # but often basic foreign keys are sufficient for this lookup table.
