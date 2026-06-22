from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base

class SenderEnum(str, enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(255), unique=True, index=True, nullable=False)
    
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String(100), nullable=True)
    customer_email = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True)
    unread_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", foreign_keys=[user_id])
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at.asc()")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    
    sender = Column(SQLEnum(SenderEnum), nullable=False)
    content = Column(Text, nullable=True)  # content can be null if it's an image
    image_url = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    session = relationship("ChatSession", back_populates="messages")
