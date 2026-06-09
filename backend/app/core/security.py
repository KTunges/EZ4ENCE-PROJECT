from datetime import datetime, timedelta
from typing import Any, Union
import jwt
import bcrypt
from app.config import settings

def hash_password(password: str) -> str:
    """Mã hóa mật khẩu sử dụng bcrypt trực tiếp"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu thô và mật khẩu đã mã hóa"""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Tạo JWT access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Mặc định lấy từ cấu hình, ví dụ 7 ngày (7d -> parsed hoặc mặc định 7 ngày)
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt
