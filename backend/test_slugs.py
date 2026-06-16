from sqlalchemy import create_engine
from app.config import settings
from sqlalchemy.orm import sessionmaker
from app.models.category import Category

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()
cats = db.query(Category).all()
for c in cats:
    print(f"Name: {c.name}, Slug: {c.slug}")
