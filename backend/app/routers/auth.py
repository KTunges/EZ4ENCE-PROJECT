import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from app.database import get_db
from app.config import settings
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse, TokenGoogle, ProfileUpdate
import string
import random
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login-form")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực thông tin đăng nhập",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Kiểm tra email tồn tại
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được sử dụng"
        )
    
    # Tạo user mới
    new_user = User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        password=security.hash_password(user_in.password),
        full_name=user_in.fullName
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # Tìm user qua email
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not security.verify_password(login_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác"
        )
    
    # Tạo JWT Token
    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=TokenResponse)
def google_auth(token_in: TokenGoogle, db: Session = Depends(get_db)):
    try:
        # Use Google access_token to get user info from Google's UserInfo API
        import requests as req
        userinfo_response = req.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token_in.token}"}
        )
        if userinfo_response.status_code != 200:
            raise ValueError("Invalid Google token")
        
        userinfo = userinfo_response.json()
        email = userinfo.get("email")
        if not email:
            raise ValueError("Email not provided by Google")
    except (ValueError, Exception):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token Google không hợp lệ"
        )

    user = db.query(User).filter(User.email == email).first()
    is_new_user = False
    
    if not user:
        # Generate random password for google user
        random_pwd = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password=security.hash_password(random_pwd),
            full_name=None  # Force user to input Display Name later
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True
    else:
        # If user exists but full_name is None, treat as needing profile update
        if not user.full_name:
            is_new_user = True

    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
        "is_new_user": is_new_user
    }

@router.put("/profile", response_model=UserResponse)
def update_profile(profile_in: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.full_name = profile_in.fullName
    db.commit()
    db.refresh(current_user)
    return current_user
