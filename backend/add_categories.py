import uuid
from sqlalchemy import create_engine
from app.config import settings
from sqlalchemy.orm import sessionmaker
from app.models.category import Category

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

new_cats = [
    {"name": "Vi xử lý (CPU)", "slug": "cpu"},
    {"name": "Bo mạch chủ (Mainboard)", "slug": "mainboard"},
    {"name": "Card màn hình (VGA)", "slug": "vga"},
    {"name": "RAM", "slug": "ram"},
    {"name": "Ổ cứng (SSD/HDD)", "slug": "storage"},
    {"name": "Nguồn (PSU)", "slug": "psu"},
    {"name": "Vỏ máy tính (Case)", "slug": "case"},
    {"name": "Tản nhiệt", "slug": "cooler"},
    {"name": "Quạt tản nhiệt (Fan)", "slug": "fan"},
    {"name": "Laptop", "slug": "laptop"},
    {"name": "Laptop Gaming", "slug": "laptop-gaming"},
    {"name": "PC EZ4ENCE", "slug": "pc-ez4ence"},
    {"name": "Màn hình", "slug": "man-hinh"},
    {"name": "Bàn phím", "slug": "ban-phim"},
    {"name": "Chuột", "slug": "chuot"},
    {"name": "Lót chuột", "slug": "lot-chuot"},
    {"name": "Tai nghe", "slug": "tai-nghe"},
    {"name": "Loa", "slug": "loa"},
    {"name": "Webcam", "slug": "webcam"},
    {"name": "Microphone", "slug": "microphone"}
]

for cat_data in new_cats:
    existing = db.query(Category).filter((Category.slug == cat_data["slug"]) | (Category.name == cat_data["name"])).first()
    if not existing:
        new_c = Category(id=str(uuid.uuid4()), name=cat_data["name"], slug=cat_data["slug"])
        db.add(new_c)

db.commit()
print("Thêm danh mục thành công!")
