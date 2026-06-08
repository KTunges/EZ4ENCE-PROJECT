from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import Role

# Base Schema
class UserBase(BaseModel):
    email: EmailStr
    fullName: Optional[str] = None

# Schema cho đăng ký
class UserCreate(UserBase):
    password: str

# Schema trả về cho API (đảm bảo ẩn password)
class UserResponse(UserBase):
    id: str
    role: Role
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

# Schema để nhận payload login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema trả về token sau login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
