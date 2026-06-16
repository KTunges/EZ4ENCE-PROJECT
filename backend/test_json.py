from sqlalchemy import create_engine, select, cast, String
from app.config import settings
from sqlalchemy.orm import sessionmaker
from app.models.product import Product

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

query = db.query(Product).filter(cast(Product.specifications["Chipset / GPU"], String).ilike("%RTX%"))
print(query.statement.compile(compile_kwargs={"literal_binds": True}))
