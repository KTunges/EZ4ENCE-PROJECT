from pydantic import BaseModel, EmailStr, Field, AliasChoices, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import Role

# Base Schema
class UserBase(BaseModel):
    email: EmailStr
    fullName: Optional[str] = Field(
        None, 
        validation_alias=AliasChoices("fullName", "full_name"), 
        serialization_alias="fullName"
    )

# Schema cho đăng ký
class UserCreate(UserBase):
    password: str

# Schema trả về cho API (đảm bảo ẩn password)
class UserResponse(UserBase):
    id: str
    role: Role
    staff_role: Optional[str] = None
    createdAt: datetime = Field(
        ..., 
        validation_alias=AliasChoices("createdAt", "created_at"), 
        serialization_alias="createdAt"
    )
    updatedAt: datetime = Field(
        ..., 
        validation_alias=AliasChoices("updatedAt", "updated_at"), 
        serialization_alias="updatedAt"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class AdminUserResponse(UserResponse):
    phone: Optional[str] = None
    is_active: bool
    total_orders: int = 0
    total_spent: int = 0

class StaffCreate(BaseModel):
    email: EmailStr
    fullName: str = Field(..., validation_alias=AliasChoices("fullName", "full_name"))
    password: str
    staff_role: str

class StaffUpdate(BaseModel):
    fullName: Optional[str] = Field(None, validation_alias=AliasChoices("fullName", "full_name"))
    staff_role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

# Schema để nhận payload login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema trả về token sau login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_new_user: Optional[bool] = False

# Schema cho Google Login
class TokenGoogle(BaseModel):
    token: str

class TokenFacebook(BaseModel):
    token: str

# Schema cho Update Profile (sau khi Google Login)
class ProfileUpdate(BaseModel):
    fullName: str = Field(..., validation_alias=AliasChoices("fullName", "full_name"))
