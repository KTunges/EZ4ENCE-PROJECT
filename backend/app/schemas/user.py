from pydantic import BaseModel, EmailStr, Field, AliasChoices, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import Role

# Base Schema
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    fullName: Optional[str] = Field(
        None, 
        validation_alias=AliasChoices("fullName", "full_name"), 
        serialization_alias="fullName"
    )

# Schema cho đăng ký
class UserCreate(UserBase):
    username: str
    password: str

# Schema trả về cho API (đảm bảo ẩn password)
class UserResponse(UserBase):
    id: str
    username: Optional[str] = None
    role: Role
    staff_role: Optional[str] = None
    is_email_verified: bool
    provider: str
    avatar: Optional[str] = None
    is_active: bool = True
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
    username: str
    password: str

class EmailOTPSend(BaseModel):
    email: EmailStr

class EmailOTPVerify(BaseModel):
    email: EmailStr
    otp: str

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

# Schema cho Quên mật khẩu
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordVerifyOTP(BaseModel):
    email: EmailStr
    otp: str

class ForgotPasswordReset(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=6)

