from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Khởi tạo engine kết nối PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,       # Kiểm tra connection còn sống trước khi dùng
    pool_recycle=300,          # Tái tạo connection sau 5 phút (tránh Supabase ngắt)
    pool_size=5,               # Số connection tối đa trong pool
    max_overflow=10,           # Cho phép thêm 10 connection khi pool đầy
    pool_timeout=30,           # Timeout chờ connection từ pool
)

# Khởi tạo Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base cho các Models kế thừa
Base = declarative_base()

# Dependency cung cấp database session cho các endpoint
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
