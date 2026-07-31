import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks, Body
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from app.database import get_db
from app.config import settings
from app.core import security
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse, TokenGoogle, ProfileUpdate, TokenFacebook, EmailOTPSend, EmailOTPVerify, ForgotPasswordRequest, ForgotPasswordVerifyOTP, ForgotPasswordReset
from app.schemas.admin_auth_schemas import AdminLoginStep1, AdminLoginStep2
from app.services.mailchimp_service import sync_user_to_mailchimp
import string
import random
import smtplib
import socket
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

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized. Admin access required.")
    return current_user

def get_current_super_admin(current_user: User = Depends(get_current_admin)) -> User:
    if current_user.staff_role != "QUAN_TRI_VIEN":
        raise HTTPException(status_code=403, detail="Quyền truy cập bị từ chối. Cần quyền QUẢN TRỊ VIÊN.")
    return current_user

def get_current_inventory(current_user: User = Depends(get_current_admin)) -> User:
    if current_user.staff_role not in ["QUAN_TRI_VIEN", "THU_KHO"]:
        raise HTTPException(status_code=403, detail="Quyền truy cập bị từ chối. Cần quyền THỦ KHO.")
    return current_user

def get_current_sales(current_user: User = Depends(get_current_admin)) -> User:
    if current_user.staff_role not in ["QUAN_TRI_VIEN", "BAN_HANG"]:
        raise HTTPException(status_code=403, detail="Quyền truy cập bị từ chối. Cần quyền BÁN HÀNG.")
    return current_user

def get_current_marketing(current_user: User = Depends(get_current_admin)) -> User:
    if current_user.staff_role not in ["QUAN_TRI_VIEN", "MARKETING"]:
        raise HTTPException(status_code=403, detail="Quyền truy cập bị từ chối. Cần quyền MARKETING.")
    return current_user

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/auth/login-form", auto_error=False)

def get_current_user_optional(token: str = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    """Trả về user nếu có token hợp lệ, trả None nếu không có token."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except jwt.InvalidTokenError:
        return None

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Kiểm tra username tồn tại
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập này đã được sử dụng"
        )
    
    # Tạo user mới
    new_user = User(
        id=str(uuid.uuid4()),
        username=user_in.username,
        email=user_in.email if user_in.email else None,
        password=security.hash_password(user_in.password),
        full_name=user_in.fullName,
        provider="LOCAL",
        is_email_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # Tìm user qua username
    user = db.query(User).filter(User.username == login_in.username).first()
    if not user or not security.verify_password(login_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác"
        )
    
    # Tạo JWT Token
    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

otp_store = {}

def send_otp_email_task(email: str, otp: str):
    if settings.SMTP_EMAIL and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = email
            msg['Subject'] = "EZ4GEAR - Mã xác thực Admin (2FA)"
            
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7fb; padding: 40px 0; margin: 0; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                  <div style="background-color: #0056b3; padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">EZ4GEAR ADMIN PORTAL</h1>
                  </div>
                  <div style="padding: 32px; text-align: center;">
                    <p style="font-size: 16px; color: #555; margin-bottom: 24px; text-align: left;">Xin chào,</p>
                    <p style="font-size: 16px; color: #555; margin-bottom: 32px; text-align: left;">Bạn đang thực hiện đăng nhập vào hệ thống Quản trị viên của EZ4GEAR. Đây là mã xác thực 2 lớp (2FA) của bạn:</p>
                    
                    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                      <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #0056b3;">{otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #888; text-align: left; margin-bottom: 8px;">* Tuyệt đối <strong>KHÔNG</strong> chia sẻ mã này cho bất kỳ ai.</p>
                  </div>
                  <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 EZ4GEAR. Hệ thống an ninh mạng.</p>
                  </div>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_body, 'html'))
            
            # Use SMTP_SSL (port 465) to bypass Render blocking port 587
            smtp_ip = str(socket.getaddrinfo(settings.SMTP_SERVER, 465, socket.AF_INET)[0][4][0])
            server = smtplib.SMTP_SSL(smtp_ip, 465, timeout=15)
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_EMAIL, email, msg.as_string())
            server.quit()
            print(f"Đã gửi OTP qua Email thành công cho {email}")
        except Exception as e:
            print(f"Lỗi khi gửi email: {e}")

@router.post("/admin-login-step1")
def admin_login_step1(login_in: AdminLoginStep1, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
    print(f"\n=========================================")
    print(f"MÃ OTP CỦA ADMIN {user.email} LÀ: {otp}")
    print(f"=========================================\n")
    
    background_tasks.add_task(send_otp_email_task, user.email, otp)
    
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

email_verification_store = {}

def send_verification_otp_email_task(email: str, otp: str):
    if settings.SMTP_EMAIL and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = email
            msg['Subject'] = "EZ4GEAR - Mã xác thực Email"
            
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 0; margin: 0; color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.1);">
                  <div style="background: linear-gradient(90deg, #1e40af 0%, #00d4ff 100%); padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">EZ4GEAR</h1>
                  </div>
                  <div style="padding: 32px; text-align: center;">
                    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 24px; text-align: left;">Xin chào,</p>
                    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px; text-align: left;">Bạn đang thực hiện <strong>Xác thực Email</strong> tại EZ4GEAR. Dưới đây là mã xác thực OTP của bạn:</p>
                    
                    <div style="background-color: #0f172a; border: 2px dashed #00d4ff; border-radius: 8px; padding: 20px; margin-bottom: 32px; box-shadow: inset 0 0 10px rgba(0,212,255,0.1);">
                      <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #00d4ff; text-shadow: 0 0 8px rgba(0,212,255,0.5);">{otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #94a3b8; text-align: left; margin-bottom: 8px;">* Tuyệt đối <strong>KHÔNG</strong> chia sẻ mã này cho bất kỳ ai.</p>
                  </div>
                  <div style="background-color: #0f172a; padding: 16px; text-align: center; border-top: 1px solid #334155;">
                    <p style="font-size: 12px; color: #64748b; margin: 0;">&copy; 2026 EZ4GEAR. The Ultimate Gaming Gear.</p>
                  </div>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_body, 'html'))
            
            # Use SMTP_SSL (port 465) to bypass Render blocking port 587
            smtp_ip = str(socket.getaddrinfo(settings.SMTP_SERVER, 465, socket.AF_INET)[0][4][0])
            server = smtplib.SMTP_SSL(smtp_ip, 465, timeout=15)
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_EMAIL, email, msg.as_string())
            server.quit()
            print(f"Đã gửi OTP xác thực email cho {email}")
        except Exception as e:
            print(f"Lỗi khi gửi email: {e}")

@router.post("/send-email-otp")
def send_email_otp(data: EmailOTPSend, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.provider != "LOCAL":
        raise HTTPException(status_code=400, detail="Không thể đổi email cho tài khoản đăng nhập qua mạng xã hội")
        
    existing_user = db.query(User).filter(User.email == data.email, User.id != current_user.id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng bởi người dùng khác")
        
    otp = f"{random.randint(0, 999999):06d}"
    email_verification_store[data.email] = otp
    print(f"\n=========================================")
    print(f"MÃ OTP XÁC THỰC EMAIL CỦA {data.email} LÀ: {otp}")
    print(f"=========================================\n")
    
    background_tasks.add_task(send_verification_otp_email_task, data.email, otp)
    
    return {"message": "OTP đã được tạo và gửi"}

@router.post("/verify-email-otp")
def verify_email_otp(data: EmailOTPVerify, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stored_otp = email_verification_store.get(data.email)
    if not stored_otp or stored_otp != data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không hợp lệ hoặc đã hết hạn")
        
    current_user.email = str(data.email)  # type: ignore
    current_user.is_email_verified = True  # type: ignore
    db.commit()
    db.refresh(current_user)
    
    del email_verification_store[data.email]
    
    background_tasks.add_task(sync_user_to_mailchimp, str(current_user.email), str(current_user.full_name) if current_user.full_name else None)
    
    return {"message": "Xác thực email thành công", "user": current_user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=TokenResponse)
def google_auth(token_in: TokenGoogle, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
        # Generate random password and username
        random_pwd = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        base_username = email.split('@')[0]
        unique_username = base_username
        while db.query(User).filter(User.username == unique_username).first():
            unique_username = f"{base_username}_{random.randint(1000, 9999)}"
        
        user = User(
            id=str(uuid.uuid4()),
            username=unique_username,
            email=email,
            password=security.hash_password(random_pwd),
            full_name=None,  # Force user to input Display Name later
            provider="GOOGLE",
            is_email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True
        background_tasks.add_task(sync_user_to_mailchimp, str(user.email), str(user.full_name) if user.full_name else None)
    else:
        # If user exists but full_name is None, treat as needing profile update
        if not user.full_name:
            is_new_user = True
        
        # Update user to Google provider and mark email as verified
        if not user.is_email_verified or user.provider == 'LOCAL':
            user.is_email_verified = True  # type: ignore
            user.provider = "GOOGLE"
            db.commit()
            db.refresh(user)
            background_tasks.add_task(sync_user_to_mailchimp, str(user.email), str(user.full_name) if user.full_name else None)

    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
        "is_new_user": is_new_user
    }

@router.post("/facebook", response_model=TokenResponse)
def facebook_auth(token_in: TokenFacebook, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
        base_username = email.split('@')[0]
        unique_username = base_username
        while db.query(User).filter(User.username == unique_username).first():
            unique_username = f"{base_username}_{random.randint(1000, 9999)}"
        
        user = User(
            id=str(uuid.uuid4()),
            username=unique_username,
            email=email,
            password=security.hash_password(random_pwd),
            full_name=fb_user.get("name"),
            avatar=fb_user.get("picture", {}).get("data", {}).get("url"),
            provider="FACEBOOK",
            is_email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True
    else:
        if not user.full_name:
            is_new_user = True
        
        if not user.is_email_verified or user.provider == 'LOCAL':
            user.is_email_verified = True  # type: ignore
            user.provider = "FACEBOOK"
            db.commit()
            db.refresh(user)
            background_tasks.add_task(sync_user_to_mailchimp, str(user.email), str(user.full_name) if user.full_name else None)

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
        result = cloudinary.uploader.upload(file.file, folder="ez4gear/avatars")
        
        # Update user avatar URL
        current_user.avatar = result.get("secure_url")
        db.commit()
        db.refresh(current_user)
        
        return current_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tải ảnh lên Cloudinary: {str(e)}")

# ====== QUÊN MẬT KHẨU ======
forgot_password_otp_store = {}

def send_forgot_password_otp_email_task(email: str, otp: str):
    if settings.SMTP_EMAIL and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = email
            msg['Subject'] = "EZ4GEAR - Đặt lại mật khẩu"
            
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 0; margin: 0; color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.1);">
                  <div style="background: linear-gradient(90deg, #dc2626 0%, #f59e0b 100%); padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">EZ4GEAR</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Đặt lại mật khẩu tài khoản</p>
                  </div>
                  <div style="padding: 32px; text-align: center;">
                    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 24px; text-align: left;">Xin chào,</p>
                    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px; text-align: left;">Bạn đang thực hiện <strong>Đặt lại mật khẩu</strong> tại EZ4GEAR. Dưới đây là mã xác thực OTP của bạn:</p>
                    
                    <div style="background-color: #0f172a; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 32px; box-shadow: inset 0 0 10px rgba(245,158,11,0.1);">
                      <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #f59e0b; text-shadow: 0 0 8px rgba(245,158,11,0.5);">{otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #94a3b8; text-align: left; margin-bottom: 8px;">* Mã có hiệu lực trong <strong>10 phút</strong>.</p>
                    <p style="font-size: 14px; color: #94a3b8; text-align: left; margin-bottom: 8px;">* Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
                  </div>
                  <div style="background-color: #0f172a; padding: 16px; text-align: center; border-top: 1px solid #334155;">
                    <p style="font-size: 12px; color: #64748b; margin: 0;">&copy; 2026 EZ4GEAR. The Ultimate Gaming Gear.</p>
                  </div>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(html_body, 'html'))
            
            # Use SMTP_SSL (port 465) to bypass Render blocking port 587
            smtp_ip = str(socket.getaddrinfo(settings.SMTP_SERVER, 465, socket.AF_INET)[0][4][0])
            server = smtplib.SMTP_SSL(smtp_ip, 465, timeout=15)
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_EMAIL, email, msg.as_string())
            server.quit()
            print(f"Đã gửi OTP đặt lại mật khẩu cho {email}")
        except Exception as e:
            print(f"Lỗi khi gửi email đặt lại mật khẩu: {e}")

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Gửi OTP đặt lại mật khẩu qua email"""
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Không tiết lộ email có tồn tại hay không (bảo mật)
        return {"message": "Nếu email tồn tại trong hệ thống, mã OTP sẽ được gửi đến email của bạn."}
    
    if user.provider != "LOCAL":
        raise HTTPException(
            status_code=400,
            detail=f"Tài khoản của bạn được đăng ký qua {user.provider}. Vui lòng đăng nhập bằng {user.provider}."
        )
    
    otp = f"{random.randint(0, 999999):06d}"
    forgot_password_otp_store[data.email] = {
        "otp": otp,
        "created_at": __import__('time').time()
    }
    print(f"\n=========================================")
    print(f"MÃ OTP ĐẶT LẠI MẬT KHẨU CHO {data.email} LÀ: {otp}")
    print(f"=========================================\n")
    
    background_tasks.add_task(send_forgot_password_otp_email_task, data.email, otp)
    
    return {"message": "Nếu email tồn tại trong hệ thống, mã OTP sẽ được gửi đến email của bạn."}

@router.post("/forgot-password/verify")
def forgot_password_verify(data: ForgotPasswordVerifyOTP, db: Session = Depends(get_db)):
    """Xác thực OTP đặt lại mật khẩu"""
    stored = forgot_password_otp_store.get(data.email)
    if not stored:
        raise HTTPException(status_code=400, detail="Mã OTP không hợp lệ hoặc đã hết hạn")
    
    # Kiểm tra OTP hết hạn (10 phút)
    import time
    if time.time() - stored["created_at"] > 600:
        del forgot_password_otp_store[data.email]
        raise HTTPException(status_code=400, detail="Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.")
    
    if stored["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác")
    
    return {"message": "Xác thực OTP thành công", "verified": True}

@router.post("/forgot-password/reset")
def forgot_password_reset(data: ForgotPasswordReset, db: Session = Depends(get_db)):
    """Đặt lại mật khẩu mới sau khi xác thực OTP"""
    stored = forgot_password_otp_store.get(data.email)
    if not stored:
        raise HTTPException(status_code=400, detail="Phiên đặt lại mật khẩu không hợp lệ")
    
    import time
    if time.time() - stored["created_at"] > 600:
        del forgot_password_otp_store[data.email]
        raise HTTPException(status_code=400, detail="Phiên đặt lại mật khẩu đã hết hạn")
    
    if stored["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác")
    
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
    
    user.password = security.hash_password(data.new_password)
    db.commit()
    
    # Xóa OTP đã sử dụng
    del forgot_password_otp_store[data.email]
    
    return {"message": "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới."}
