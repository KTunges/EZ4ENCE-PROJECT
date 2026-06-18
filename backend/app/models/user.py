import enum
from sqlalchemy import Column, String, Enum, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from app.database import Base


class Role(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # UUID dạng chuỗi
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    avatar = Column(String, nullable=True)  # URL ảnh đại diện từ Cloudinary
    role = Column(Enum(Role), default=Role.USER, nullable=False)
    staff_role = Column(String, nullable=True) # e.g. SUPER_ADMIN, SALES, INVENTORY
    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    provider = Column(String, default="LOCAL", nullable=False) # LOCAL, GOOGLE, FACEBOOK
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    cart = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
