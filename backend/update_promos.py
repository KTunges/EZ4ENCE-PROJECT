import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.marketing import Promotion

def update_shipping_promos():
    db = SessionLocal()
    try:
        # Set all shipping promos to public
        db.query(Promotion).filter(Promotion.type == 'shipping').update({Promotion.is_public: True})
        db.commit()
        print("Successfully updated shipping promos to public.")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_shipping_promos()
