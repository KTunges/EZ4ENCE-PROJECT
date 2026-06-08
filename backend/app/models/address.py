from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)  # Tên người nhận
    phone = Column(String, nullable=False)
    address_line = Column(String, nullable=False)  # Số nhà, đường
    ward = Column(String, nullable=True)  # Phường/Xã
    district = Column(String, nullable=False)  # Quận/Huyện
    city = Column(String, nullable=False)  # Tỉnh/Thành phố
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="shipping_address")
