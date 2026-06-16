import uuid
from datetime import datetime, timezone
import json
from app.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.category import Category
from app.models.brand import Brand
from app.models.product import Product, ProductSKU, ProductImage

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def main():
    db = SessionLocal()
    
    brand_names = ["Logitech", "Razer", "Akko", "HyperX", "Harman Kardon", "Lian Li", "Wooting"]
    brand_map = {}
    for bname in brand_names:
        b = db.query(Brand).filter(Brand.name.ilike(bname)).first()
        if not b:
            b = Brand(
                id=str(uuid.uuid4()),
                name=bname,
                slug=bname.lower().replace(" ", "-"),
                description="",
                logo_url="",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(b)
            db.commit()
            db.refresh(b)
        brand_map[bname] = b.id

    cat_slugs = ["chuot", "chuot-gaming", "ban-phim", "tai-nghe", "loa", "case", "nguon"]
    cat_map = {}
    for cslug in cat_slugs:
        c = db.query(Category).filter(Category.slug == cslug).first()
        if not c:
            cname = cslug.capitalize()
            c = Category(
                id=str(uuid.uuid4()),
                name=cname,
                slug=cslug,
                description="",
                image="",
                parent_id=None,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(c)
            db.commit()
            db.refresh(c)
        cat_map[cslug] = c.id

    new_prods = [
        {
            "name": "Chuột Logitech G Pro X Superlight",
            "slug": "logitech-g-pro-x-superlight-mock",
            "brand_name": "Logitech",
            "category_slug": "chuot",
            "price": 2500000,
            "desc": "Chuột không dây siêu nhẹ cho game thủ",
            "specs": {"Kết nối": "Không dây Lightspeed", "DPI": "25000", "Trọng lượng": "63g"}
        },
        {
            "name": "Chuột Razer DeathAdder V3 Pro",
            "slug": "razer-deathadder-v3-pro-mock",
            "brand_name": "Razer",
            "category_slug": "chuot",
            "price": 3200000,
            "desc": "Chuột gaming công thái học cao cấp",
            "specs": {"Kết nối": "Không dây Hyperspeed", "DPI": "30000", "Trọng lượng": "63g"}
        },
        {
            "name": "Bàn phím cơ Akko MOD007 PC",
            "slug": "akko-mod007-pc-mock",
            "brand_name": "Akko",
            "category_slug": "ban-phim",
            "price": 1800000,
            "desc": "Bàn phím cơ custom giá rẻ",
            "specs": {"Loại Switch": "Akko CS", "Kích thước": "TKL", "Kết nối": "Có dây"}
        },
        {
            "name": "Bàn phím Wooting 60HE",
            "slug": "wooting-60he-mock",
            "brand_name": "Wooting",
            "category_slug": "ban-phim",
            "price": 4500000,
            "desc": "Bàn phím analog tốt nhất thế giới",
            "specs": {"Loại Switch": "Lekker", "Kích thước": "60%", "Kết nối": "Có dây"}
        },
        {
            "name": "Tai nghe HyperX Cloud III",
            "slug": "hyperx-cloud-iii-mock",
            "brand_name": "HyperX",
            "category_slug": "tai-nghe",
            "price": 2200000,
            "desc": "Tai nghe gaming thoải mái nhất",
            "specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
        },
        {
            "name": "Tai nghe Razer BlackShark V2",
            "slug": "razer-blackshark-v2-mock2",
            "brand_name": "Razer",
            "category_slug": "tai-nghe",
            "price": 2500000,
            "desc": "Tai nghe e-sports chuyên nghiệp",
            "specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
        },
        {
            "name": "Vỏ Case Lian Li O11 Dynamic EVO",
            "slug": "lian-li-o11-dynamic-evo-mock",
            "brand_name": "Lian Li",
            "category_slug": "case",
            "price": 3800000,
            "desc": "Vỏ case bể cá huyền thoại",
            "specs": {"Kích thước": "Mid Tower", "Màu sắc": "Trắng", "Chất liệu": "Nhôm, Kính cường lực"}
        },
        {
            "name": "Loa Harman Kardon SoundSticks 4",
            "slug": "harman-kardon-soundsticks-4-mock",
            "brand_name": "Harman Kardon",
            "category_slug": "loa",
            "price": 6500000,
            "desc": "Loa bluetooth thiết kế trong suốt",
            "specs": {"Kết nối": "Bluetooth", "Công suất": "140W", "Màu sắc": "Trắng"}
        }
    ]

    for p in new_prods:
        existing = db.query(Product).filter(Product.slug == p['slug']).first()
        if existing:
            continue
            
        pid = str(uuid.uuid4())
        prod = Product(
            id=pid,
            name=p['name'],
            slug=p['slug'],
            description=p['desc'],
            category_id=cat_map.get(p['category_slug']),
            brand_id=brand_map.get(p['brand_name']),
            specifications=p['specs'],
            is_published=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(prod)
        
        sku = ProductSKU(
            id=str(uuid.uuid4()),
            product_id=pid,
            sku_code="SKU-" + p['slug'].upper()[:20],
            price=p['price'],
            promotional_price=None,
            stock_quantity=100,
            attributes={},
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(sku)
        
        img = ProductImage(
            id=str(uuid.uuid4()),
            product_id=pid,
            url="https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344660/ez4ence/products/tai-nghe-razer-blackshark-v2-1.jpg",
            alt_text=p['name'],
            is_primary=True
        )
        db.add(img)
    
    db.commit()
    print("Done inserting products & skus & images directly into DB")

if __name__ == "__main__":
    main()
