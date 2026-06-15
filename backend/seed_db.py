import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

from app.models.user import User, Role
from app.models.category import Category
from app.models.brand import Brand
from app.models.product import Product, ProductSKU, ProductImage
from app.models.news import News
from app.models.marketing import Banner
from app.core.security import hash_password

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_users(db):
    print("Seeding users...")
    admins = [
        {"email": "kimtung5576@gmail.com", "name": "Kim Tùng (Super Admin)", "password": "123456"},
        {"email": "phanleminh1@gmail.com", "name": "Phan Lê Minh (Super Admin)", "password": "123456"}
    ]
    for ad in admins:
        if not db.query(User).filter(User.email == ad["email"]).first():
            user = User(
                id=str(uuid.uuid4()),
                email=ad["email"],
                password=hash_password(ad["password"]),
                full_name=ad["name"],
                role=Role.ADMIN,
                is_active=True
            )
            db.add(user)
    db.commit()

def seed_categories(db):
    print("Seeding categories...")
    cats = [
        {"name": "Laptop Gaming", "slug": "laptop-gaming"},
        {"name": "PC Lắp Ráp", "slug": "pc-lap-rap"},
        {"name": "Linh Kiện PC", "slug": "linh-kien-pc"},
        {"name": "Màn Hình", "slug": "man-hinh"},
        {"name": "Bàn Phím Cơ", "slug": "ban-phim-co"},
        {"name": "Chuột Gaming", "slug": "chuot-gaming"}
    ]
    for c in cats:
        if not db.query(Category).filter(Category.name == c["name"]).first():
            cat = Category(id=str(uuid.uuid4()), name=c["name"], slug=c["slug"])
            db.add(cat)
    db.commit()

def seed_brands(db):
    print("Seeding brands...")
    brands = [
        {"name": "ASUS", "slug": "asus", "logo_url": "https://cdn.simpleicons.org/asus/white"},
        {"name": "MSI", "slug": "msi", "logo_url": "https://cdn.simpleicons.org/msi/white"},
        {"name": "Corsair", "slug": "corsair", "logo_url": "https://cdn.simpleicons.org/corsair/white"},
        {"name": "NVIDIA", "slug": "nvidia", "logo_url": "https://cdn.simpleicons.org/nvidia/white"},
        {"name": "Intel", "slug": "intel", "logo_url": "https://cdn.simpleicons.org/intel/white"}
    ]
    for b in brands:
        if not db.query(Brand).filter(Brand.name == b["name"]).first():
            brand = Brand(id=str(uuid.uuid4()), name=b["name"], slug=b["slug"], logo_url=b["logo_url"])
            db.add(brand)
    db.commit()

def seed_products(db):
    print("Seeding products...")
    laptop_cat = db.query(Category).filter(Category.slug == "laptop-gaming").first()
    asus_brand = db.query(Brand).filter(Brand.slug == "asus").first()

    if laptop_cat and asus_brand:
        if not db.query(Product).filter(Product.slug == "asus-rog-strix-scar-16").first():
            prod = Product(
                id=str(uuid.uuid4()),
                name="Laptop Gaming ASUS ROG Strix SCAR 16",
                slug="asus-rog-strix-scar-16",
                description="<p>Mẫu laptop gaming mạnh mẽ nhất thế giới.</p>",
                specifications={"CPU": "Intel Core i9 14900HX", "RAM": "32GB DDR5", "VGA": "RTX 4090 16GB", "SSD": "2TB NVMe Gen4"},
                category_id=laptop_cat.id,
                brand_id=asus_brand.id,
                is_published=True
            )
            db.add(prod)
            db.flush()
            
            sku = ProductSKU(
                id=str(uuid.uuid4()),
                product_id=prod.id,
                sku_code="ASUS-ROG-16",
                price=110000000,
                promotional_price=105000000,
                stock_quantity=10,
                attributes={"color": "Black"}
            )
            db.add(sku)
            
            img = ProductImage(
                id=str(uuid.uuid4()),
                product_id=prod.id,
                url="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
                is_primary=True
            )
            db.add(img)
            db.commit()

def seed_news(db):
    print("Seeding news...")
    news_data = [
      {
        "title": 'NVIDIA RTX 5090 rò rỉ thông số khủng, mạnh gấp đôi RTX 4090?',
        "slug": 'nvidia-rtx-5090-ro-ri-thong-so-khung',
        "image_url": 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
        "category": 'Phần Cứng'
      },
      {
        "title": 'Intel Core Ultra 200 series chính thức ra mắt, thiết lập tiêu chuẩn mới',
        "slug": 'intel-core-ultra-200-series-chinh-thuc-ra-mat',
        "image_url": 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
        "category": 'CPU'
      },
      {
        "title": 'Apple hé lộ chip M4 Max cực mạnh trên MacBook Pro thế hệ mới',
        "slug": 'apple-he-lo-chip-m4-max',
        "image_url": 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        "category": 'Laptop'
      },
      {
        "title": 'Top 5 bàn phím cơ Custom đáng mua nhất tầm giá dưới 2 triệu',
        "slug": 'top-5-ban-phim-co-custom-duoi-2-trieu',
        "image_url": 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80',
        "category": 'Đánh Giá'
      }
    ]
    for n in news_data:
        if not db.query(News).filter(News.slug == n["slug"]).first():
            news_item = News(
                id=str(uuid.uuid4()),
                title=n["title"],
                slug=n["slug"],
                content="<p>Đây là bài viết chi tiết được tạo tự động bởi hệ thống... Bạn có thể tự do chỉnh sửa nội dung bài viết này thông qua trình quản lý Admin nhé.</p>",
                summary="Tin tức công nghệ mới nhất trong ngày. Nắm bắt xu hướng, cập nhật phần cứng, trải nghiệm công nghệ tuyệt đỉnh.",
                image_url=n["image_url"],
                category=n["category"],
                is_active=True,
                published_at=datetime.now(timezone.utc)
            )
            db.add(news_item)
    db.commit()

def seed_banners(db):
    print("Seeding banners...")
    BANNERS = [
      {"title": "Bento Main 1", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", "position": "bento_main", "link_url": "/products"},
      {"title": "Bento Main 2", "image_url": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80", "position": "bento_main", "link_url": "/products"},
      {"title": "Bento Main 3", "image_url": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80", "position": "bento_main", "link_url": "/products"},
      {"title": "Bento Side 1", "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80", "position": "bento_side", "link_url": "/products?category=pc"},
      {"title": "Bento Side 2", "image_url": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80", "position": "bento_side", "link_url": "/products?category=ban-phim"},
      {"title": "Bento Bottom 1", "image_url": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80", "position": "bento_bottom", "link_url": "/products?category=laptop"},
      {"title": "Bento Bottom 2", "image_url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80", "position": "bento_bottom", "link_url": "/products?category=laptop-office"},
      {"title": "Bento Bottom 3", "image_url": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80", "position": "bento_bottom", "link_url": "/products?category=pc-gaming"},
      {"title": "SETUP MƠ ƯỚC", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80", "position": "home_middle", "link_url": "/products"},
      {"title": "BÙNG NỔ ƯU ĐÃI", "image_url": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1920&q=80", "position": "home_bottom", "link_url": "/products"},
    ]
    for b in BANNERS:
        if not db.query(Banner).filter(Banner.image_url == b["image_url"], Banner.position == b["position"]).first():
            banner_item = Banner(
                id=str(uuid.uuid4()),
                title=b["title"],
                image_url=b["image_url"],
                link_url=b["link_url"],
                position=b["position"],
                is_active=True
            )
            db.add(banner_item)
    db.commit()

def main():
    print("Starting database seed...")
    db = SessionLocal()
    try:
        seed_users(db)
        seed_categories(db)
        seed_brands(db)
        seed_products(db)
        seed_news(db)
        seed_banners(db)
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
