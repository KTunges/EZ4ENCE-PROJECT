import asyncio
import os
import sys

# Thêm thư mục gốc vào sys.path để import app.database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.category import Category
from app.models.brand import Brand
from app.models.product import Product
from app.models.user import User, Role
import uuid

def seed():
    db: Session = SessionLocal()
    try:
        print("Starting seed database...")
        
        # 1. Seed User Admin (nếu chưa có)
        admin_email = "admin@ez4ence.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            # Lưu ý: Trong thực tế cần hash password. Ở đây seed đơn giản.
            admin_user = User(
                id=str(uuid.uuid4()),
                email=admin_email,
                password="hashed_password_here", # Cần hash bằng bcrypt
                full_name="Administrator",
                role=Role.ADMIN,
                is_active=True
            )
            db.add(admin_user)

        # 2. Seed Categories
        categories_data = [
            {"name": "Gaming PC", "slug": "gaming-pc", "description": "High performance gaming PCs"},
            {"name": "Laptops", "slug": "laptops", "description": "Gaming and office laptops"},
            {"name": "Peripherals", "slug": "peripherals", "description": "Keyboards, mice, and headsets"}
        ]
        category_objects = {}
        for cat in categories_data:
            c = db.query(Category).filter(Category.slug == cat["slug"]).first()
            if not c:
                c = Category(
                    id=str(uuid.uuid4()),
                    name=cat["name"],
                    slug=cat["slug"],
                    description=cat["description"],
                    image=""
                )
                db.add(c)
            category_objects[cat["slug"]] = c
        
        db.commit()

        # Lấy lại category id sau khi commit
        for c in category_objects.values():
            db.refresh(c)

        # 3. Seed Brands
        brands_data = [
            {"name": "Asus", "slug": "asus"},
            {"name": "MSI", "slug": "msi"},
            {"name": "Corsair", "slug": "corsair"}
        ]
        brand_objects = {}
        for b_data in brands_data:
            b = db.query(Brand).filter(Brand.slug == b_data["slug"]).first()
            if not b:
                b = Brand(
                    id=str(uuid.uuid4()),
                    name=b_data["name"],
                    slug=b_data["slug"],
                    logo_url=""
                )
                db.add(b)
            brand_objects[b_data["slug"]] = b

        db.commit()

        # Lấy lại brand id sau khi commit
        for b in brand_objects.values():
            db.refresh(b)

        # 4. Seed Products
        products_data = [
            {
                "name": "Asus ROG Strix G15",
                "slug": "asus-rog-strix-g15",
                "price": 30000000,
                "stock": 10,
                "category_id": category_objects["laptops"].id,
                "brand_id": brand_objects["asus"].id,
                "images": ["https://via.placeholder.com/150"]
            },
            {
                "name": "Corsair K70 RGB",
                "slug": "corsair-k70-rgb",
                "price": 3500000,
                "stock": 50,
                "category_id": category_objects["peripherals"].id,
                "brand_id": brand_objects["corsair"].id,
                "images": ["https://via.placeholder.com/150"]
            }
        ]
        
        from app.models.product import ProductSKU, ProductImage
        for p_data in products_data:
            p = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if not p:
                p_id = str(uuid.uuid4())
                p = Product(
                    id=p_id,
                    name=p_data["name"],
                    slug=p_data["slug"],
                    category_id=p_data["category_id"],
                    brand_id=p_data["brand_id"],
                    is_published=True,
                    specifications={}
                )
                db.add(p)
                
                sku = ProductSKU(
                    id=str(uuid.uuid4()),
                    product_id=p_id,
                    sku_code=f"SKU-{p_data['slug']}",
                    price=p_data["price"],
                    stock_quantity=p_data["stock"],
                    attributes={}
                )
                db.add(sku)
                
                for img_url in p_data["images"]:
                    img = ProductImage(
                        id=str(uuid.uuid4()),
                        product_id=p_id,
                        url=img_url,
                        is_primary=True
                    )
                    db.add(img)

        db.commit()
        print("Seed database success!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
