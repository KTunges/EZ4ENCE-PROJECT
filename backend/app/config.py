from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # API Config
    PORT: int = 3000
    PROJECT_NAME: str = "EZ4GEAR E-Commerce API"
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_HOST: str = "127.0.0.1"
    REDIS_PORT: int = 6379
    
    # Security
    JWT_SECRET: str
    JWT_EXPIRATION: str = "7d"
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # Google Auth
    GOOGLE_CLIENT_ID: Optional[str] = None

    # Facebook Auth
    FACEBOOK_APP_ID: Optional[str] = None
    FACEBOOK_APP_SECRET: Optional[str] = None

    # PayPal
    PAYPAL_CLIENT_ID: Optional[str] = None
    PAYPAL_CLIENT_SECRET: Optional[str] = None
    PAYPAL_ENVIRONMENT: str = "sandbox"

    # VNPAY
    VNPAY_TMN_CODE: Optional[str] = None
    VNPAY_HASH_SECRET: Optional[str] = None
    VNPAY_URL: str = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    VNPAY_RETURN_URL: str = "http://localhost:5173/checkout/vnpay-return"

    # SMTP for Email Sending
    SMTP_EMAIL: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    
    # Mailchimp (Email Marketing)
    MAILCHIMP_API_KEY: Optional[str] = None
    MAILCHIMP_SERVER_PREFIX: Optional[str] = None
    MAILCHIMP_LIST_ID: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
