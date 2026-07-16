import os
import sys
import uuid
from sqlalchemy import text

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from app.database import engine, SessionLocal
from app.models.inventory import Supplier, StockReceipt, StockReceiptItem
from app.models.brand import Brand

def migrate_and_seed():
    db = SessionLocal()
    try:
        # 1. Add brand_id column to suppliers
        try:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE suppliers ADD COLUMN brand_id VARCHAR;"))
                conn.commit()
                print("Added brand_id column to suppliers.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("Column brand_id already exists.")
            else:
                print(f"Migration error (might be okay if sqlite/postgres diff): {e}")

        # 2. Clear existing inventory data to prevent foreign key constraint issues
        db.query(StockReceiptItem).delete()
        db.query(StockReceipt).delete()
        db.query(Supplier).delete()
        db.commit()
        print("Cleared old inventory data.")

        # 3. Fetch all brands
        brands = db.query(Brand).all()
        print(f"Found {len(brands)} brands.")

        # 4. Create one supplier per brand
        for b in brands:
            sup = Supplier(
                id=uuid.uuid4().hex,
                name=f"Nhà phân phối {b.name}",
                contact_name=f"Đại diện {b.name}",
                phone="0123456789",
                email=f"contact@{b.slug}.com",
                brand_id=b.id
            )
            db.add(sup)
        
        db.commit()
        print(f"Seeded {len(brands)} suppliers successfully.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_and_seed()
