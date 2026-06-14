import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from app.database import get_db
from app.config import settings
from app.core import security
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse, TokenGoogle, ProfileUpdate, TokenFacebook
from app.schemas.admin_auth_schemas import AdminLoginStep1, AdminLoginStep2
import string
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import cloudinary
import cloudinary.uploader

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
        user_id = payload.get("sub")
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

otp_store = {}

@router.post("/admin-login-step1")
def admin_login_step1(login_in: AdminLoginStep1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not security.verify_password(login_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác"
        )
    if user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản không có quyền Quản trị viên"
        )
    
    otp = f"{random.randint(0, 999999):06d}"
    otp_store[user.email] = otp
    print(f"\\n=========================================")
    print(f"MÃ OTP CỦA ADMIN {user.email} LÀ: {otp}")
    print(f"=========================================\\n")
    
    # Gửi qua Email nếu có cấu hình SMTP
    if settings.SMTP_EMAIL and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = user.email
            msg['Subject'] = "EZ4ENCE - Mã xác thực Admin (2FA)"
            
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7fb; padding: 40px 0; margin: 0; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                  <div style="background-color: #0056b3; padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">EZ4ENCE ADMIN PORTAL</h1>
                  </div>
                  <div style="padding: 32px; text-align: center;">
                    <p style="font-size: 16px; color: #555; margin-bottom: 24px; text-align: left;">Xin chào,</p>
                    <p style="font-size: 16px; color: #555; margin-bottom: 32px; text-align: left;">Bạn đang thực hiện đăng nhập vào hệ thống Quản trị viên của EZ4ENCE. Đây là mã xác thực 2 lớp (2FA) của bạn:</p>
                    
                    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                      <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #0056b3;">{otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #888; text-align: left; margin-bottom: 8px;">* Tuyệt đối <strong>KHÔNG</strong> chia sẻ mã này cho bất kỳ ai.</p>
                  </div>
                  <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 EZ4ENCE. Hệ thống an ninh mạng.</p>
                  </div>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_body, 'html'))
            
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_EMAIL, user.email, msg.as_string())
            server.quit()
            print(f"Đã gửi OTP qua Email thành công cho {user.email}")
        except Exception as e:
            print(f"Lỗi khi gửi email: {e}")
    
    return {"message": "OTP đã được tạo", "email": user.email}

@router.post("/admin-login-step2", response_model=TokenResponse)
def admin_login_step2(login_in: AdminLoginStep2, db: Session = Depends(get_db)):
    stored_otp = otp_store.get(login_in.email)
    if not stored_otp or stored_otp != login_in.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã OTP không hợp lệ hoặc đã hết hạn"
        )
    
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
        
    del otp_store[login_in.email]
    
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
        import requests as req  # type: ignore
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

@router.post("/facebook", response_model=TokenResponse)
def facebook_auth(token_in: TokenFacebook, db: Session = Depends(get_db)):
    try:
        import requests as req  # type: ignore
        # Lấy thông tin user từ Graph API của Facebook
        url = f"https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token={token_in.token}"
        res = req.get(url)
        if res.status_code != 200:
            raise ValueError("Invalid Facebook token")
            
        fb_user = res.json()
        email = fb_user.get("email")
        if not email:
            raise ValueError("Email not provided by Facebook")
            
    except (ValueError, Exception):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token Facebook không hợp lệ"
        )

    user = db.query(User).filter(User.email == email).first()
    is_new_user = False
    
    if not user:
        random_pwd = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password=security.hash_password(random_pwd),
            full_name=fb_user.get("name"),
            avatar=fb_user.get("picture", {}).get("data", {}).get("url")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
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
    current_user.full_name = profile_in.fullName  # type: ignore
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/profile/avatar", response_model=UserResponse)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
        raise HTTPException(status_code=500, detail="Cloudinary chưa được cấu hình. Vui lòng thêm key vào file .env.")

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

    try:
        # Upload file to cloudinary
        result = cloudinary.uploader.upload(file.file, folder="ez4ence/avatars")
        
        # Update user avatar URL
        current_user.avatar = result.get("secure_url")
        db.commit()
        db.refresh(current_user)
        
        return current_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tải ảnh lên Cloudinary: {str(e)}")
