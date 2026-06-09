from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # API Config
    PORT: int = 3000
    PROJECT_NAME: str = "EZ4ENCE E-Commerce API"
    
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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
