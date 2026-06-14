from pydantic import BaseModel, EmailStr

class AdminLoginStep1(BaseModel):
    email: EmailStr
    password: str

class AdminLoginStep2(BaseModel):
    email: EmailStr
    otp: str
