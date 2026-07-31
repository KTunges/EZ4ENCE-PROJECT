from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

# Khởi tạo engine kết nối PostgreSQL với NullPool 
# (Vì Supabase Pooler port 6543 đã tự động quản lý connection pool ở chế độ Transaction)
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=NullPool
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
