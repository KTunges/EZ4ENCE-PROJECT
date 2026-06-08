from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Khởi tạo engine kết nối PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
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
