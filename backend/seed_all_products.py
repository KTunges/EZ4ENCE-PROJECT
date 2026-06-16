"""
🛒 EZ4GEAR - Script đổ dữ liệu sản phẩm TOÀN BỘ cho tất cả danh mục.
Phủ hết mọi mục trong CategorySidebar mega menu.
Chạy: python seed_all_products.py
"""
import uuid
import unicodedata
import re
from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.product import Product, ProductSKU, ProductImage
from app.models.category import Category
from app.models.brand import Brand

engine = create_engine(settings.DATABASE_URL)
db = sessionmaker(bind=engine)()

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def img(text):
    """Match product name to real product image from Unsplash"""
    REAL_IMAGES = {
        # Laptop
        "VivoBook": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        "HP Pavilion": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop",
        "Acer Swift": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
        "MSI Modern": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
        "IdeaPad": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
        "Dell Inspiron": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
        "Macbook Air": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
        "Macbook Pro": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
        "Zenbook": "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=400&h=400&fit=crop",
        "HP Envy": "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&fit=crop",
        # Laptop Gaming
        "ROG Zephyrus": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
        "TUF Gaming": "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop",
        "MSI Stealth": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
        "Lenovo Legion": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop",
        "Predator": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop",
        "Nitro": "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=400&fit=crop",
        "Dell G15": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
        "HP OMEN": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop",
        "HP Victus": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop",
        "MSI Thin": "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=400&fit=crop",
        "ROG Strix": "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop",
        "Lenovo LOQ": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop",
        # PC
        "PC EZ4ENCE Gaming Starter": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
        "PC EZ4ENCE Gaming Pro": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        "PC EZ4ENCE Hi-End": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
        "Văn Phòng": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop",
        "Đồ Họa": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        "Mini ITX": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
        "Custom Nước": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
        "Full White": "https://images.unsplash.com/photo-1587202372634-0e984e826724?w=400&h=400&fit=crop",
        "RGB Showcase": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        # CPU
        "CPU Intel": "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop",
        "CPU AMD": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop",
        # VGA / GPU
        "RTX": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        "Radeon": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        # Mainboard
        "Mainboard": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        # RAM
        "RAM": "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop",
        # SSD/HDD
        "SSD": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
        "HDD": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=400&fit=crop",
        # PSU
        "Nguồn": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop",
        # Case
        "Case": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
        # Cooler
        "Tản nhiệt": "https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop",
        "Fan Case": "https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop",
        # Màn hình
        "Màn hình ASUS": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
        "Màn hình LG": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop",
        "Màn hình Samsung": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop",
        "Màn hình Dell": "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop",
        "Màn hình MSI": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
        # Bàn phím
        "Akko": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
        "Keychron": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
        "Logitech G Pro": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
        "Razer Huntsman": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
        "Corsair K70": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
        # Chuột
        "Razer Viper": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
        "Logitech G502": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        "Pulsar X2": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
        "Corsair M75": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        "Zowie": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
        "DeathAdder": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        # Lót chuột
        "Artisan": "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop",
        "Lót chuột": "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop",
        # Tai nghe
        "WH-1000XM5": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "G PRO X 2": "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
        "Galaxy Buds": "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
        "WF-1000XM5": "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
        "HS80": "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
        "Cloud III": "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
        # Loa
        "Edifier": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop",
        "Creative Pebble": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        "JBL": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop",
        "Stage SE": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop",
        # Webcam
        "Webcam": "https://images.unsplash.com/photo-1596566193621-b2a2da5b8831?w=400&h=400&fit=crop",
        # Microphone
        "QuadCast": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
        "Seiren": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
        "Wave:3": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
        # Mạng
        "Router": "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop",
        "Wifi Mesh": "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop",
        "Office": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
        "Switch TP": "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop",
        "USB Thu Wifi": "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop",
        "Windows 11": "https://images.unsplash.com/photo-1624571409024-feafa6141849?w=400&h=400&fit=crop",
        "Kaspersky": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop",
        "Adobe": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop",
        # Console
        "Nintendo Switch": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
        "ROG Ally": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
        "PlayStation": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
        "Xbox Series": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop",
        "Steam Deck": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
        "DualSense": "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop",
        "Xbox Wireless": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop",
        "Logitech F310": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop",
        "Thrustmaster": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop",
        "God of War": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
        "Zelda": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
        # Phụ kiện
        "Balo": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        "Hub USB": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
        "Giá treo": "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop",
        "USB Samsung": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
        "Đế tản nhiệt": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
        "Pin dự phòng": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
        "Cáp sạc": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
        # Dịch vụ
        "Cài đặt Windows": "https://images.unsplash.com/photo-1624571409024-feafa6141849?w=400&h=400&fit=crop",
        "Bảo hành": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop",
        "Vệ sinh": "https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop",
        "Thu cũ": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop",
    }
    for keyword, url in REAL_IMAGES.items():
        if keyword.lower() in text.lower():
            return url
    # Fallback
    safe = quote(text[:30])
    return f"https://placehold.co/400x400/1a1a2e/00d4ff?text={safe}"

def get_or_create_brand(name):
    slug = slugify(name)
    brand = db.query(Brand).filter(Brand.name == name).first()
    if not brand:
        brand = db.query(Brand).filter(Brand.slug == slug).first()
    if not brand:
        brand = Brand(id=str(uuid.uuid4()), name=name, slug=slug)
        db.add(brand)
        db.flush()
    return brand.id

def add_product(cat_name, brand_name, name, price, sale_price, stock, specs, image_url=''):
    # Find canonical slug for this category name
    canonical_slug = None
    for c in CANONICAL_CATEGORIES:
        if c['name'] == cat_name:
            canonical_slug = c['slug']
            break
    if not canonical_slug:
        print(f"  ⚠️ Category '{cat_name}' not in CANONICAL! Skipping {name}")
        return
    
    cat = db.query(Category).filter(Category.slug == canonical_slug).first()
    if not cat:
        print(f"  ⚠️ Category slug '{canonical_slug}' not found! Skipping {name}")
        return

    slug = slugify(name)
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        slug = f"{slug}-{str(uuid.uuid4())[:6]}"

    exists = db.query(Product).filter(Product.name == name).first()
    if exists:
        return

    brand_id = get_or_create_brand(brand_name)
    if not image_url:
        image_url = img(name)

    product = Product(
        id=str(uuid.uuid4()),
        name=name,
        slug=slug,
        description=f"{name} - Sản phẩm chính hãng {brand_name}, bảo hành tại EZ4GEAR.",
        specifications=specs,
        category_id=cat.id,
        brand_id=brand_id,
        is_published=True
    )
    db.add(product)
    db.flush()

    sku = ProductSKU(
        id=str(uuid.uuid4()),
        product_id=product.id,
        sku_code=f"SKU-{slug[:15].upper()}-{str(uuid.uuid4())[:4]}",
        price=price,
        promotional_price=sale_price,
        stock_quantity=stock,
        attributes={}
    )
    db.add(sku)

    if image_url:
        img_obj = ProductImage(
            id=str(uuid.uuid4()),
            product_id=product.id,
            url=image_url,
            is_primary=True
        )
        db.add(img_obj)

    print(f"  ✅ [{cat_name}] {name}")

# ═══════════════════════════════════════════════════════════
# CANONICAL CATEGORIES
# ═══════════════════════════════════════════════════════════
CANONICAL_CATEGORIES = [
    {"name": "Laptop",               "slug": "laptop"},
    {"name": "Laptop Gaming",        "slug": "laptop-gaming"},
    {"name": "PC EZ4ENCE",           "slug": "pc-ez4ence"},
    {"name": "Vi xử lý (CPU)",       "slug": "cpu"},
    {"name": "Bo mạch chủ (Mainboard)", "slug": "mainboard"},
    {"name": "Card màn hình (VGA)",   "slug": "vga"},
    {"name": "RAM",                   "slug": "ram"},
    {"name": "Ổ cứng (SSD/HDD)",     "slug": "storage"},
    {"name": "Nguồn (PSU)",          "slug": "psu"},
    {"name": "Vỏ máy tính (Case)",   "slug": "case"},
    {"name": "Tản nhiệt",            "slug": "cooler"},
    {"name": "Màn hình",             "slug": "man-hinh"},
    {"name": "Bàn phím",             "slug": "ban-phim"},
    {"name": "Chuột",                "slug": "chuot"},
    {"name": "Lót chuột",            "slug": "lot-chuot"},
    {"name": "Tai nghe",             "slug": "tai-nghe"},
    {"name": "Loa",                  "slug": "loa"},
    {"name": "Webcam",               "slug": "webcam"},
    {"name": "Microphone",           "slug": "microphone"},
    {"name": "Phần mềm, mạng",      "slug": "phan-mem-mang"},
    {"name": "Handheld, Console",    "slug": "console"},
    {"name": "Phụ kiện",             "slug": "phu-kien"},
    {"name": "Dịch vụ",              "slug": "dich-vu"},
]

def run_seed_products():
    print("\n" + "=" * 60)
    print("🛒 BẮT ĐẦU SEED SẢN PHẨM TOÀN BỘ...")
    print("=" * 60)

    # Tạo categories
    for c in CANONICAL_CATEGORIES:
        if not db.query(Category).filter(Category.slug == c['slug']).first():
            cat = Category(id=str(uuid.uuid4()), name=c['name'], slug=c['slug'])
            db.add(cat)
    db.commit()

    # ═══════════════════════════════════════════════════════
    # 1. LAPTOP
    # ═══════════════════════════════════════════════════════
    print("\n📂 LAPTOP")
    add_product("Laptop", "ASUS", "Laptop ASUS VivoBook 15 OLED A1505VA", 18990000, 17490000, 20,
        {"cpu": "Intel Core i5-13500H", "ram": "16GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "15.6 inch OLED FHD"})
    add_product("Laptop", "HP", "Laptop HP Pavilion 15-eg3098TU", 14990000, None, 15,
        {"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "15.6 inch FHD IPS"})
    add_product("Laptop", "Acer", "Laptop Acer Swift 3 SF314-512", 16990000, 15990000, 12,
        {"cpu": "Intel Core i5-1240P", "ram": "16GB LPDDR5", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "14 inch 2K IPS"})
    add_product("Laptop", "MSI", "Laptop MSI Modern 14 C13M", 13990000, 12990000, 18,
        {"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "14 inch FHD IPS"})
    add_product("Laptop", "Lenovo", "Laptop Lenovo IdeaPad Slim 5 14IAH8", 15990000, None, 14,
        {"cpu": "Intel Core i5-12500H", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "14 inch 2.8K OLED"})
    add_product("Laptop", "Dell", "Laptop Dell Inspiron 15 3530", 13490000, 12490000, 20,
        {"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "Màn hình": "15.6 inch FHD IPS"})
    add_product("Laptop", "Apple", "Macbook Air M2 2024 13 inch", 27990000, 25990000, 10,
        {"cpu": "Apple M2 8-Core", "ram": "8GB Unified", "storage": "SSD 256GB", "vga": "Apple M2 10-Core GPU", "Màn hình": "13.6 inch Liquid Retina"})
    add_product("Laptop", "Apple", "Macbook Pro M3 14 inch", 39990000, 37990000, 6,
        {"cpu": "Apple M3 Pro 11-Core", "ram": "18GB Unified", "storage": "SSD 512GB", "vga": "Apple M3 Pro 14-Core GPU", "Màn hình": "14.2 inch Liquid Retina XDR"})
    add_product("Laptop", "ASUS", "Laptop ASUS Zenbook 14 OLED UX3405MA (Đồ hoạ)", 22990000, 21490000, 8,
        {"cpu": "Intel Core Ultra 7 155H", "ram": "16GB LPDDR5X", "storage": "SSD 1TB", "vga": "Intel Arc Graphics", "Màn hình": "14 inch 3K OLED 120Hz"})
    add_product("Laptop", "HP", "Laptop HP Envy x360 14-fa0013TU (Cảm ứng)", 19990000, None, 10,
        {"cpu": "Intel Core Ultra 5 125U", "ram": "16GB LPDDR5", "storage": "SSD 512GB", "vga": "Intel Arc Graphics", "Màn hình": "14 inch 2.8K OLED Touch, xoay 360°"})

    # ═══════════════════════════════════════════════════════
    # 2. LAPTOP GAMING
    # ═══════════════════════════════════════════════════════
    print("\n📂 LAPTOP GAMING")
    add_product("Laptop Gaming", "ASUS", "Laptop Gaming ASUS ROG Zephyrus G14 GA403UI", 45990000, 42990000, 8,
        {"cpu": "AMD Ryzen 9 8945HS", "ram": "16GB LPDDR5X", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "Màn hình": "14 inch 2K OLED 120Hz"})
    add_product("Laptop Gaming", "ASUS", "Laptop Gaming ASUS TUF Gaming A15 FA507NV", 24990000, 22990000, 15,
        {"cpu": "AMD Ryzen 7 7735HS", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4060 8GB", "Màn hình": "15.6 inch FHD 144Hz"})
    add_product("Laptop Gaming", "MSI", "Laptop Gaming MSI Stealth 16 AI Studio A1VIG", 55990000, None, 5,
        {"cpu": "Intel Core Ultra 9 185H", "ram": "32GB DDR5", "storage": "SSD 2TB", "vga": "NVIDIA RTX 4090 16GB", "Màn hình": "16 inch 4K OLED 120Hz"})
    add_product("Laptop Gaming", "Lenovo", "Laptop Gaming Lenovo Legion 5 Pro 16IRX9", 32990000, 30990000, 10,
        {"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "Màn hình": "16 inch 2K IPS 165Hz"})
    add_product("Laptop Gaming", "Acer", "Laptop Gaming Acer Predator Helios Neo 16 PHN16-72", 35990000, 33990000, 7,
        {"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "Màn hình": "16 inch 2K IPS 165Hz"})
    add_product("Laptop Gaming", "Acer", "Laptop Gaming Acer Nitro V 15 ANV15-51", 19990000, 18490000, 20,
        {"cpu": "Intel Core i5-13420H", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "Màn hình": "15.6 inch FHD 144Hz"})
    add_product("Laptop Gaming", "Dell", "Laptop Gaming Dell G15 5530 Alienware", 27990000, 25990000, 8,
        {"cpu": "Intel Core i7-13650HX", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4060 8GB", "Màn hình": "15.6 inch FHD 165Hz"})
    add_product("Laptop Gaming", "HP", "Laptop Gaming HP OMEN 16-wd0013TX", 29990000, 27990000, 8,
        {"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4060 8GB", "Màn hình": "16 inch 2K IPS 165Hz"})
    add_product("Laptop Gaming", "HP", "Laptop Gaming HP Victus 15-fa1093TX", 17990000, 16490000, 22,
        {"cpu": "Intel Core i5-12450H", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "Màn hình": "15.6 inch FHD 144Hz"})
    add_product("Laptop Gaming", "MSI", "Laptop Gaming MSI Thin GF63 12UC", 15990000, 14490000, 25,
        {"cpu": "Intel Core i5-12450H", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "Màn hình": "15.6 inch FHD 144Hz"})
    add_product("Laptop Gaming", "ASUS", "Laptop Gaming ASUS ROG Strix G16 G614JI", 49990000, 46990000, 5,
        {"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 Ti 8GB", "Màn hình": "16 inch 2K IPS 240Hz"})
    add_product("Laptop Gaming", "Lenovo", "Laptop Gaming Lenovo LOQ 15IAX9", 17990000, 16490000, 25,
        {"cpu": "Intel Core i5-12450HX", "ram": "12GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 3050 6GB", "Màn hình": "15.6 inch FHD 144Hz"})

    # ═══════════════════════════════════════════════════════
    # 3. PC EZ4ENCE
    # ═══════════════════════════════════════════════════════
    print("\n📂 PC EZ4ENCE")
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Gaming Starter - Intel i5 13400F / RTX 4060", 18500000, 17500000, 10,
        {"cpu": "Intel Core i5-13400F", "ram": "16GB DDR5 5600MHz", "vga": "NVIDIA GeForce RTX 4060 8GB", "storage": "SSD NVMe 500GB", "mainboard": "B760M", "psu": "650W 80+ Bronze", "case": "EZ4GEAR S1 Mesh"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti", 35000000, 32900000, 8,
        {"cpu": "AMD Ryzen 7 7700X", "ram": "32GB DDR5 6000MHz", "vga": "NVIDIA GeForce RTX 4070 Ti Super 16GB", "storage": "SSD NVMe 1TB", "mainboard": "B650 AORUS Elite AX", "psu": "850W 80+ Gold", "case": "NZXT H9 Flow"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Hi-End - Intel i9 14900K / RTX 4090", 75000000, 72000000, 3,
        {"cpu": "Intel Core i9-14900K", "ram": "64GB DDR5 6400MHz", "vga": "NVIDIA GeForce RTX 4090 24GB", "storage": "SSD NVMe 2TB + HDD 4TB", "mainboard": "Z790 AORUS Master", "psu": "1200W 80+ Platinum", "case": "Lian Li O11D EVO XL"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730", 8500000, None, 30,
        {"cpu": "Intel Core i3-13100", "ram": "8GB DDR4 3200MHz", "vga": "Intel UHD 730", "storage": "SSD NVMe 256GB", "mainboard": "H610M", "psu": "450W 80+", "case": "EZ4GEAR Compact S"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Đồ Họa - AMD Ryzen 9 7950X / RTX 4080 Super", 55000000, None, 5,
        {"cpu": "AMD Ryzen 9 7950X", "ram": "64GB DDR5 5600MHz ECC", "vga": "NVIDIA GeForce RTX 4080 Super 16GB", "storage": "SSD NVMe 2TB", "mainboard": "X670E AORUS Master", "psu": "1000W 80+ Gold", "case": "Fractal Design Meshify 2 XL"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Mini ITX - Intel i5 14400F / RTX 4060", 22000000, 20500000, 8,
        {"cpu": "Intel Core i5-14400F", "ram": "16GB DDR5 5600MHz", "vga": "NVIDIA GeForce RTX 4060 8GB", "storage": "SSD NVMe 1TB", "mainboard": "B760I Mini-ITX", "psu": "600W SFX 80+ Gold", "case": "Cooler Master NR200P"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Custom Nước - Intel i9 14900KS / RTX 4090", 120000000, None, 2,
        {"cpu": "Intel Core i9-14900KS", "ram": "64GB DDR5 7200MHz", "vga": "NVIDIA GeForce RTX 4090 24GB", "storage": "SSD NVMe 4TB", "mainboard": "Z790 ROG MAXIMUS HERO", "psu": "1600W 80+ Titanium", "case": "Custom Open Loop + Ống cứng", "Tản nhiệt": "Full Custom Water Cooling Loop"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE Full White RGB - AMD Ryzen 5 7600X / RTX 4060 Ti", 28000000, 26500000, 6,
        {"cpu": "AMD Ryzen 5 7600X", "ram": "32GB DDR5 6000MHz (Trắng)", "vga": "NVIDIA RTX 4060 Ti 8GB White", "storage": "SSD NVMe 1TB", "mainboard": "B650M AORUS Elite AX White", "psu": "750W 80+ Gold White", "case": "NZXT H7 Flow White", "Tản nhiệt": "AIO 360mm White ARGB"})
    add_product("PC EZ4ENCE", "EZ4GEAR", "PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super", 42000000, 39900000, 4,
        {"cpu": "Intel Core i7-14700KF", "ram": "32GB DDR5 6000MHz RGB", "vga": "NVIDIA RTX 4070 Super 12GB", "storage": "SSD NVMe 1TB", "mainboard": "Z790 AORUS Elite AX", "psu": "850W 80+ Gold", "case": "Lian Li O11 Dynamic EVO RGB", "Tản nhiệt": "AIO 360mm LCD RGB"})

    # ═══════════════════════════════════════════════════════
    # 4. CPU
    # ═══════════════════════════════════════════════════════
    print("\n📂 CPU")
    add_product("Vi xử lý (CPU)", "Intel", "CPU Intel Core i3-14100F", 2890000, None, 50,
        {"Socket": "LGA 1700", "Số nhân/luồng": "4 nhân 8 luồng", "Xung nhịp": "3.5GHz - 4.7GHz", "Cache": "12MB", "TDP": "58W"})
    add_product("Vi xử lý (CPU)", "Intel", "CPU Intel Core i5-14600KF", 6990000, 6490000, 40,
        {"Socket": "LGA 1700", "Số nhân/luồng": "14 nhân 20 luồng", "Xung nhịp": "3.5GHz - 5.3GHz", "Cache": "24MB", "TDP": "125W"})
    add_product("Vi xử lý (CPU)", "Intel", "CPU Intel Core i7-14700K", 10490000, 9990000, 25,
        {"Socket": "LGA 1700", "Số nhân/luồng": "20 nhân 28 luồng", "Xung nhịp": "3.4GHz - 5.6GHz", "Cache": "33MB", "TDP": "125W"})
    add_product("Vi xử lý (CPU)", "Intel", "CPU Intel Core i9-14900K", 14990000, 13990000, 15,
        {"Socket": "LGA 1700", "Số nhân/luồng": "24 nhân 32 luồng", "Xung nhịp": "3.2GHz - 6.0GHz", "Cache": "36MB", "TDP": "125W"})
    add_product("Vi xử lý (CPU)", "AMD", "CPU AMD Ryzen 5 7600X", 5490000, 4990000, 35,
        {"Socket": "AM5", "Số nhân/luồng": "6 nhân 12 luồng", "Xung nhịp": "4.7GHz - 5.3GHz", "Cache": "38MB", "TDP": "105W"})
    add_product("Vi xử lý (CPU)", "AMD", "CPU AMD Ryzen 7 7800X3D", 9990000, 9490000, 20,
        {"Socket": "AM5", "Số nhân/luồng": "8 nhân 16 luồng", "Xung nhịp": "4.2GHz - 5.0GHz", "Cache": "104MB (3D V-Cache)", "TDP": "120W"})
    add_product("Vi xử lý (CPU)", "AMD", "CPU AMD Ryzen 9 7950X", 13990000, 12990000, 10,
        {"Socket": "AM5", "Số nhân/luồng": "16 nhân 32 luồng", "Xung nhịp": "4.5GHz - 5.7GHz", "Cache": "80MB", "TDP": "170W"})

    # ═══════════════════════════════════════════════════════
    # 5. MAINBOARD
    # ═══════════════════════════════════════════════════════
    print("\n📂 MAINBOARD")
    add_product("Bo mạch chủ (Mainboard)", "ASUS", "Mainboard ASUS ROG STRIX B760-F GAMING WIFI", 6290000, None, 15,
        {"Socket": "LGA 1700", "Chipset": "Intel B760", "Kích thước": "ATX", "Cổng kết nối": "DDR5, PCIe 5.0, WiFi 6E"})
    add_product("Bo mạch chủ (Mainboard)", "MSI", "Mainboard MSI MAG B650 TOMAHAWK WIFI", 5790000, 5290000, 18,
        {"Socket": "AM5", "Chipset": "AMD B650", "Kích thước": "ATX", "Cổng kết nối": "DDR5, PCIe 4.0, WiFi 6E"})
    add_product("Bo mạch chủ (Mainboard)", "Gigabyte", "Mainboard GIGABYTE B760M AORUS ELITE AX DDR4", 3890000, None, 25,
        {"Socket": "LGA 1700", "Chipset": "Intel B760", "Kích thước": "Micro-ATX", "Cổng kết nối": "DDR4, PCIe 4.0, WiFi 6E"})
    add_product("Bo mạch chủ (Mainboard)", "ASUS", "Mainboard ASUS PRIME B650M-A WIFI II", 3690000, 3390000, 20,
        {"Socket": "AM5", "Chipset": "AMD B650", "Kích thước": "Micro-ATX", "Cổng kết nối": "DDR5, PCIe 4.0, WiFi 6"})
    add_product("Bo mạch chủ (Mainboard)", "Gigabyte", "Mainboard GIGABYTE Z790 AORUS ELITE AX DDR5", 7290000, None, 10,
        {"Socket": "LGA 1700", "Chipset": "Intel Z790", "Kích thước": "ATX", "Cổng kết nối": "DDR5, PCIe 5.0, WiFi 6E, 2.5G LAN"})

    # ═══════════════════════════════════════════════════════
    # 6. VGA
    # ═══════════════════════════════════════════════════════
    print("\n📂 VGA")
    add_product("Card màn hình (VGA)", "ASUS", "VGA ASUS TUF Gaming GeForce RTX 4070 Super OC 12GB", 16990000, 15990000, 12,
        {"Chipset / GPU": "NVIDIA GeForce RTX 4070 Super", "Bộ nhớ": "12GB GDDR6X", "Cổng xuất hình": "HDMI 2.1, 3x DP 1.4a", "TDP": "220W"})
    add_product("Card màn hình (VGA)", "MSI", "VGA MSI GeForce RTX 4060 VENTUS 2X 8G OC", 8490000, 7990000, 20,
        {"Chipset / GPU": "NVIDIA GeForce RTX 4060", "Bộ nhớ": "8GB GDDR6", "Cổng xuất hình": "HDMI 2.1, 3x DP 1.4a", "TDP": "115W"})
    add_product("Card màn hình (VGA)", "Gigabyte", "VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G", 22990000, None, 8,
        {"Chipset / GPU": "NVIDIA GeForce RTX 4070 Ti Super", "Bộ nhớ": "16GB GDDR6X", "Cổng xuất hình": "HDMI 2.1, 3x DP 1.4a", "TDP": "285W"})
    add_product("Card màn hình (VGA)", "ASUS", "VGA ASUS Dual GeForce RTX 4060 Ti OC 8GB", 11990000, 10990000, 15,
        {"Chipset / GPU": "NVIDIA GeForce RTX 4060 Ti", "Bộ nhớ": "8GB GDDR6", "Cổng xuất hình": "HDMI 2.1, 3x DP 1.4a", "TDP": "160W"})
    add_product("Card màn hình (VGA)", "MSI", "VGA MSI GeForce RTX 4080 Super VENTUS 3X OC 16G", 29990000, 28490000, 6,
        {"Chipset / GPU": "NVIDIA GeForce RTX 4080 Super", "Bộ nhớ": "16GB GDDR6X", "Cổng xuất hình": "HDMI 2.1, 3x DP 1.4a", "TDP": "320W"})
    add_product("Card màn hình (VGA)", "Sapphire", "VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB", 14990000, 13990000, 10,
        {"Chipset / GPU": "AMD Radeon RX 7900 GRE", "Bộ nhớ": "16GB GDDR6", "Cổng xuất hình": "HDMI 2.1, 2x DP 2.1", "TDP": "260W"})
    add_product("Card màn hình (VGA)", "Sapphire", "VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB", 12990000, 11990000, 12,
        {"Chipset / GPU": "AMD Radeon RX 7800 XT", "Bộ nhớ": "16GB GDDR6", "Cổng xuất hình": "HDMI 2.1, 2x DP 2.1", "TDP": "263W"})

    # ═══════════════════════════════════════════════════════
    # 7. RAM
    # ═══════════════════════════════════════════════════════
    print("\n📂 RAM")
    add_product("RAM", "G.Skill", "RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz", 3290000, 2990000, 30,
        {"Dung lượng": "32GB (2x16GB)", "Chuẩn kết nối": "DDR5", "Tốc độ đọc": "6000MHz", "CAS Latency": "CL30"})
    add_product("RAM", "Kingston", "RAM Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz", 1290000, None, 50,
        {"Dung lượng": "16GB (1x16GB)", "Chuẩn kết nối": "DDR5", "Tốc độ đọc": "5600MHz", "CAS Latency": "CL36"})
    add_product("RAM", "Corsair", "RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6400MHz", 3890000, 3590000, 20,
        {"Dung lượng": "32GB (2x16GB)", "Chuẩn kết nối": "DDR5", "Tốc độ đọc": "6400MHz", "CAS Latency": "CL32"})
    add_product("RAM", "Kingston", "RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz", 890000, None, 60,
        {"Dung lượng": "16GB (2x8GB)", "Chuẩn kết nối": "DDR4", "Tốc độ đọc": "3200MHz", "CAS Latency": "CL16"})
    add_product("RAM", "Kingston", "RAM Kingston Fury Impact 16GB DDR5 4800MHz SODIMM (Laptop)", 1190000, None, 40,
        {"Dung lượng": "16GB (1x16GB)", "Chuẩn kết nối": "DDR5 SODIMM (Laptop)", "Tốc độ đọc": "4800MHz", "CAS Latency": "CL38"})

    # ═══════════════════════════════════════════════════════
    # 8. Ổ CỨNG
    # ═══════════════════════════════════════════════════════
    print("\n📂 Ổ CỨNG")
    add_product("Ổ cứng (SSD/HDD)", "Samsung", "SSD Samsung 990 EVO 1TB PCIe Gen 5.0 x2 NVMe M.2", 2990000, 2690000, 30,
        {"Dung lượng": "1TB", "Chuẩn kết nối": "NVMe PCIe Gen 5.0 x2", "Tốc độ đọc": "5000 MB/s", "Tốc độ ghi": "4200 MB/s"})
    add_product("Ổ cứng (SSD/HDD)", "Western Digital", "SSD WD Black SN850X 2TB PCIe Gen 4.0 x4 NVMe M.2", 4290000, 3990000, 20,
        {"Dung lượng": "2TB", "Chuẩn kết nối": "NVMe PCIe Gen 4.0 x4", "Tốc độ đọc": "7300 MB/s", "Tốc độ ghi": "6600 MB/s"})
    add_product("Ổ cứng (SSD/HDD)", "Kingston", "SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2", 890000, None, 60,
        {"Dung lượng": "500GB", "Chuẩn kết nối": "NVMe PCIe Gen 4.0", "Tốc độ đọc": "3500 MB/s", "Tốc độ ghi": "2100 MB/s"})
    add_product("Ổ cứng (SSD/HDD)", "Samsung", "SSD Samsung 870 EVO 1TB SATA III 2.5 inch", 2490000, 2290000, 25,
        {"Dung lượng": "1TB", "Chuẩn kết nối": "SATA III 2.5 inch", "Tốc độ đọc": "560 MB/s", "Tốc độ ghi": "530 MB/s"})
    add_product("Ổ cứng (SSD/HDD)", "Seagate", "HDD Seagate Barracuda 2TB 7200RPM 3.5 inch", 1490000, None, 30,
        {"Dung lượng": "2TB", "Chuẩn kết nối": "SATA III 3.5 inch HDD", "Tốc độ đọc": "220 MB/s", "Tốc độ quay": "7200 RPM"})

    # ═══════════════════════════════════════════════════════
    # 9. NGUỒN (PSU)
    # ═══════════════════════════════════════════════════════
    print("\n📂 NGUỒN (PSU)")
    add_product("Nguồn (PSU)", "Corsair", "Nguồn Corsair RM750e 750W 80 Plus Gold - Full Modular", 2490000, None, 20,
        {"Công suất": "750W", "Chuẩn": "80 Plus Gold", "Kích thước": "ATX", "Modular": "Full Modular"})
    add_product("Nguồn (PSU)", "DeepCool", "Nguồn DeepCool PX1000G 1000W 80 Plus Gold - Full Modular", 3290000, 2990000, 15,
        {"Công suất": "1000W", "Chuẩn": "80 Plus Gold", "Kích thước": "ATX 3.0", "Modular": "Full Modular"})
    add_product("Nguồn (PSU)", "Corsair", "Nguồn Corsair CV550 550W 80 Plus Bronze", 1190000, None, 30,
        {"Công suất": "550W", "Chuẩn": "80 Plus Bronze", "Kích thước": "ATX", "Modular": "Non-Modular"})
    add_product("Nguồn (PSU)", "ASUS", "Nguồn ASUS ROG STRIX 850W 80 Plus Gold - Full Modular", 3490000, 3190000, 12,
        {"Công suất": "850W", "Chuẩn": "80 Plus Gold", "Kích thước": "ATX 3.0", "Modular": "Full Modular"})
    add_product("Nguồn (PSU)", "DeepCool", "Nguồn DeepCool PK650D 650W 80 Plus Bronze", 1290000, None, 25,
        {"Công suất": "650W", "Chuẩn": "80 Plus Bronze", "Kích thước": "ATX", "Modular": "Non-Modular"})

    # ═══════════════════════════════════════════════════════
    # 10. VỎ CASE
    # ═══════════════════════════════════════════════════════
    print("\n📂 VỎ CASE")
    add_product("Vỏ máy tính (Case)", "NZXT", "Case NZXT H5 Flow RGB Matte White", 2490000, None, 18,
        {"Kích thước": "Mid Tower ATX", "Chất liệu": "Thép + Kính cường lực", "Fan": "2x 120mm RGB", "Màu sắc": "Trắng"})
    add_product("Vỏ máy tính (Case)", "Corsair", "Case Corsair 5000D Airflow Black", 3990000, 3690000, 10,
        {"Kích thước": "Mid Tower ATX", "Chất liệu": "Thép + Kính cường lực", "Fan": "2x 120mm", "Màu sắc": "Đen"})
    add_product("Vỏ máy tính (Case)", "Lianli", "Case Lian Li LANCOOL III RGB White", 3290000, None, 12,
        {"Kích thước": "Mid Tower E-ATX", "Chất liệu": "Nhôm + Kính cường lực", "Fan": "3x 140mm ARGB", "Màu sắc": "Trắng"})
    add_product("Vỏ máy tính (Case)", "ASUS", "Case ASUS TUF Gaming GT302 ARGB Black", 2790000, 2490000, 15,
        {"Kích thước": "Mid Tower ATX", "Chất liệu": "Thép + Kính cường lực", "Fan": "4x 140mm ARGB", "Màu sắc": "Đen"})

    # ═══════════════════════════════════════════════════════
    # 11. TẢN NHIỆT
    # ═══════════════════════════════════════════════════════
    print("\n📂 TẢN NHIỆT")
    add_product("Tản nhiệt", "NZXT", "Tản nhiệt nước NZXT Kraken 280 RGB Black", 3490000, 3190000, 12,
        {"Kiểu": "AIO Liquid Cooler", "Kích thước Radiator": "280mm", "Fan": "2x 140mm RGB", "Socket": "Intel LGA 1700/AM5"})
    add_product("Tản nhiệt", "DeepCool", "Tản nhiệt khí DeepCool AK620 Digital", 1590000, None, 20,
        {"Kiểu": "Tower Air Cooler", "TDP": "260W", "Fan": "2x 120mm", "Socket": "Intel LGA 1700/AM5"})
    add_product("Tản nhiệt", "Corsair", "Tản nhiệt nước Corsair iCUE H150i ELITE LCD XT", 6990000, 6490000, 8,
        {"Kiểu": "AIO Liquid Cooler", "Kích thước Radiator": "360mm", "Fan": "3x 120mm RGB", "Màn hình": "LCD 2.1 inch IPS"})
    add_product("Tản nhiệt", "Corsair", "Tản nhiệt nước Corsair iCUE H100i ELITE 240mm ARGB", 3290000, 2990000, 14,
        {"Kiểu": "AIO Liquid Cooler", "Kích thước Radiator": "240mm", "Fan": "2x 120mm ARGB", "Socket": "Intel LGA 1700/AM5"})
    add_product("Tản nhiệt", "Lianli", "Fan Case Lian Li UNI FAN SL-INFINITY 120 RGB 3 Pack", 1890000, None, 20,
        {"Kiểu": "Case Fan RGB", "Kích thước": "120mm x3", "LED": "Infinity Mirror ARGB", "Tốc độ quay": "800-2100 RPM"})

    # ═══════════════════════════════════════════════════════
    # 12. MÀN HÌNH
    # ═══════════════════════════════════════════════════════
    print("\n📂 MÀN HÌNH")
    add_product("Màn hình", "ASUS", "Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)", 12990000, 11990000, 10,
        {"Kích thước": "27 inch", "Độ phân giải": "4K UHD (3840x2160)", "Tần số quét": "60Hz", "Tấm nền": "IPS", "Nhu cầu": "Đồ họa chuyên nghiệp"})
    add_product("Màn hình", "LG", "Màn hình LG 27GP850-B 27 inch 2K 165Hz Nano IPS (Gaming)", 8990000, 7990000, 15,
        {"Kích thước": "27 inch", "Độ phân giải": "2K QHD (2560x1440)", "Tần số quét": "165Hz", "Tấm nền": "Nano IPS", "Nhu cầu": "Gaming"})
    add_product("Màn hình", "Samsung", "Màn hình Samsung Odyssey G9 G95SC 49 inch Curved DQHD 240Hz", 32990000, 29990000, 5,
        {"Kích thước": "49 inch Ultrawide", "Độ phân giải": "Dual QHD (5120x1440)", "Tần số quét": "240Hz", "Tấm nền": "OLED", "Nhu cầu": "Gaming Ultrawide"})
    add_product("Màn hình", "Dell", "Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C", 11490000, None, 12,
        {"Kích thước": "27 inch", "Độ phân giải": "4K UHD (3840x2160)", "Tần số quét": "60Hz", "Tấm nền": "IPS Black", "Nhu cầu": "Văn phòng cao cấp"})
    add_product("Màn hình", "MSI", "Màn hình MSI MAG 274QRF QD E2 27 inch 2K 180Hz (Gaming)", 7990000, 7490000, 18,
        {"Kích thước": "27 inch", "Độ phân giải": "2K QHD (2560x1440)", "Tần số quét": "180Hz", "Tấm nền": "Rapid IPS + Quantum Dot", "Nhu cầu": "Gaming"})
    add_product("Màn hình", "Dell", "Màn hình Dell P2422H 24 inch FHD IPS (Văn phòng)", 4990000, 4490000, 25,
        {"Kích thước": "24 inch", "Độ phân giải": "FHD (1920x1080)", "Tần số quét": "60Hz", "Tấm nền": "IPS", "Nhu cầu": "Văn phòng"})
    add_product("Màn hình", "ASUS", "Màn hình ASUS VG27AQ1A 27 inch 2K 170Hz IPS (Gaming)", 7490000, 6990000, 15,
        {"Kích thước": "27 inch", "Độ phân giải": "2K QHD (2560x1440)", "Tần số quét": "170Hz", "Tấm nền": "IPS", "Nhu cầu": "Gaming"})
    add_product("Màn hình", "Samsung", "Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming)", 3490000, 3190000, 25,
        {"Kích thước": "24 inch", "Độ phân giải": "FHD (1920x1080)", "Tần số quét": "144Hz", "Tấm nền": "VA", "Nhu cầu": "Gaming giá rẻ"})
    add_product("Màn hình", "ASUS", "Màn hình ASUS ProArt PA148CTV 14 inch FHD Touch (Cảm ứng)", 8990000, None, 8,
        {"Kích thước": "14 inch Portable", "Độ phân giải": "FHD (1920x1080)", "Tần số quét": "60Hz", "Tấm nền": "IPS Touch", "Nhu cầu": "Cảm ứng di động"})

    # ═══════════════════════════════════════════════════════
    # 13. BÀN PHÍM
    # ═══════════════════════════════════════════════════════
    print("\n📂 BÀN PHÍM")
    add_product("Bàn phím", "Akko", "Bàn phím cơ Akko 3098B Multi-Modes Blue on White", 1690000, 1490000, 30,
        {"Loại Switch": "Akko CS Jelly White", "Kết nối": "Bluetooth / 2.4GHz / USB-C", "Kích thước": "98% (100 phím)", "Keycap": "PBT Double-shot", "LED": "RGB"})
    add_product("Bàn phím", "Keychron", "Bàn phím cơ Keychron Q1 Pro QMK/VIA", 4290000, None, 12,
        {"Loại Switch": "Gateron Jupiter Red", "Kết nối": "Bluetooth / USB-C", "Kích thước": "75% (84 phím)", "Keycap": "PBT Double-shot", "LED": "RGB South-facing"})
    add_product("Bàn phím", "Logitech", "Bàn phím cơ Logitech G Pro X TKL LIGHTSPEED", 3290000, 2990000, 15,
        {"Loại Switch": "GX Red", "Kết nối": "LIGHTSPEED 2.4GHz / Bluetooth / USB-C", "Kích thước": "TKL (87 phím)", "LED": "LIGHTSYNC RGB"})
    add_product("Bàn phím", "Razer", "Bàn phím cơ Razer Huntsman V3 Pro TKL", 5490000, 4990000, 10,
        {"Loại Switch": "Razer Analog Optical (Adjustable)", "Kết nối": "USB-C có dây", "Kích thước": "TKL (87 phím)", "Keycap": "PBT Doubleshot", "LED": "Razer Chroma RGB"})
    add_product("Bàn phím", "Corsair", "Bàn phím cơ Corsair K70 MAX RGB", 4790000, 4290000, 12,
        {"Loại Switch": "Corsair MGX (Magnetic Hall Effect)", "Kết nối": "USB-C có dây", "Kích thước": "Fullsize (104 phím)", "Keycap": "PBT Double-shot", "LED": "RGB"})
    add_product("Bàn phím", "Akko", "Bàn phím cơ Akko 3068B Plus Black & Gold (Mini 65%)", 1290000, None, 25,
        {"Loại Switch": "Akko CS Crystal", "Kết nối": "Bluetooth / 2.4GHz / USB-C", "Kích thước": "65% Mini (68 phím)", "Keycap": "PBT Double-shot", "LED": "RGB"})

    # ═══════════════════════════════════════════════════════
    # 14. CHUỘT
    # ═══════════════════════════════════════════════════════
    print("\n📂 CHUỘT")
    add_product("Chuột", "Razer", "Chuột Razer Viper V3 Pro", 4290000, 3990000, 15,
        {"Mắt đọc": "Razer Focus Pro 4K (35000 DPI)", "DPI": "35000", "Kết nối": "HyperSpeed Wireless / USB-C", "Trọng lượng": "54g", "Switch": "Razer Gen-3 Optical", "Pin": "90 giờ"})
    add_product("Chuột", "Logitech", "Chuột Logitech G502 X PLUS LIGHTSPEED", 3290000, 2990000, 20,
        {"Mắt đọc": "HERO 25K (25600 DPI)", "DPI": "25600", "Kết nối": "LIGHTSPEED / Bluetooth / USB-C", "Trọng lượng": "106g", "Switch": "LIGHTFORCE Hybrid", "Pin": "130 giờ"})
    add_product("Chuột", "Pulsar", "Chuột Pulsar X2H Medium Wireless", 2190000, None, 25,
        {"Mắt đọc": "PAW3395 (26000 DPI)", "DPI": "26000", "Kết nối": "2.4GHz / USB-C", "Trọng lượng": "56g", "Switch": "Kailh GM 8.0", "Pin": "100 giờ"})
    add_product("Chuột", "Corsair", "Chuột Corsair M75 AIR Wireless", 2990000, 2690000, 15,
        {"Mắt đọc": "Corsair MARKSMAN (26000 DPI)", "DPI": "26000", "Kết nối": "SLIPSTREAM / Bluetooth / USB-C", "Trọng lượng": "60g", "Switch": "Omron Optical", "Pin": "100 giờ"})
    add_product("Chuột", "Zowie", "Chuột Zowie EC2-CW Wireless (Esports)", 2890000, None, 12,
        {"Mắt đọc": "Zowie 3395 (3200 DPI)", "DPI": "3200", "Kết nối": "2.4GHz Wireless / USB-C", "Trọng lượng": "77g", "Switch": "Huano", "Pin": "70 giờ"})
    add_product("Chuột", "Razer", "Chuột Razer DeathAdder V3 HyperSpeed Có Dây", 1590000, 1390000, 30,
        {"Mắt đọc": "Razer Focus X (18000 DPI)", "DPI": "18000", "Kết nối": "USB có dây", "Trọng lượng": "59g", "Switch": "Razer Gen-2 Mechanical"})

    # ═══════════════════════════════════════════════════════
    # 15. LÓT CHUỘT
    # ═══════════════════════════════════════════════════════
    print("\n📂 LÓT CHUỘT")
    add_product("Lót chuột", "Artisan", "Lót chuột Artisan FX Hayate Otsu V2 XL Soft", 1890000, None, 15,
        {"Kích thước": "490 x 420 x 4mm", "Chất liệu": "Vải đặc biệt + Foam đế", "Bề mặt": "Speed / Control Hybrid"})
    add_product("Lót chuột", "Razer", "Lót chuột Razer Gigantus V2 XXL (Deskmat)", 690000, None, 30,
        {"Kích thước": "940 x 410 x 4mm", "Chất liệu": "Micro-weave Cloth", "Bề mặt": "Control"})
    add_product("Lót chuột", "SteelSeries", "Lót chuột SteelSeries QcK Heavy XXL", 590000, None, 35,
        {"Kích thước": "900 x 400 x 6mm", "Chất liệu": "Micro-woven Cloth", "Bề mặt": "Control (dày 6mm)"})
    add_product("Lót chuột", "Pulsar", "Lót chuột Pulsar Superglide Glass XL (Kính)", 1290000, None, 20,
        {"Kích thước": "490 x 420 x 3mm", "Chất liệu": "Kính tempered", "Bề mặt": "Speed (cực trơn)"})
    add_product("Lót chuột", "Razer", "Lót chuột Razer Firefly V2 Pro RGB", 1790000, 1590000, 12,
        {"Kích thước": "370 x 280 x 4mm (Size nhỏ)", "Chất liệu": "Hard Surface + RGB", "Bề mặt": "Speed", "LED": "Razer Chroma RGB 15 zone"})
    add_product("Lót chuột", "SteelSeries", "Lót chuột SteelSeries QcK Prism Cloth XL RGB", 990000, 890000, 18,
        {"Kích thước": "900 x 300 x 4mm (Deskmat)", "Chất liệu": "Micro-woven Cloth + RGB", "Bề mặt": "Control", "LED": "2-zone RGB"})

    # ═══════════════════════════════════════════════════════
    # 16. TAI NGHE
    # ═══════════════════════════════════════════════════════
    print("\n📂 TAI NGHE")
    add_product("Tai nghe", "Sony", "Tai nghe Sony WH-1000XM5 Wireless (Over-ear)", 7990000, 6990000, 15,
        {"Kiểu dáng": "Over-ear", "Kết nối": "Bluetooth 5.3 / 3.5mm", "Microphone": "8 mic ANC", "Tần số đáp ứng": "4Hz - 40kHz", "Pin": "30 giờ"})
    add_product("Tai nghe", "Logitech", "Tai nghe Logitech G PRO X 2 LIGHTSPEED (Over-ear Gaming)", 4990000, 4490000, 12,
        {"Kiểu dáng": "Over-ear", "Kết nối": "LIGHTSPEED / Bluetooth / 3.5mm", "Microphone": "Blue VO!CE", "Tần số đáp ứng": "20Hz - 20kHz", "Pin": "50 giờ"})
    add_product("Tai nghe", "Samsung", "Tai nghe Samsung Galaxy Buds FE True Wireless (In-ear)", 1990000, 1690000, 25,
        {"Kiểu dáng": "In-ear True Wireless", "Kết nối": "Bluetooth 5.2", "Microphone": "3 mic ANC", "Tần số đáp ứng": "20Hz - 20kHz", "Pin": "6 giờ (30 giờ với case)"})
    add_product("Tai nghe", "Sony", "Tai nghe Sony WF-1000XM5 True Wireless (In-ear)", 5990000, 5290000, 12,
        {"Kiểu dáng": "In-ear True Wireless", "Kết nối": "Bluetooth 5.3 / LDAC", "Microphone": "6 mic ANC", "Tần số đáp ứng": "20Hz - 40kHz", "Pin": "8 giờ (24 giờ với case)"})
    add_product("Tai nghe", "Corsair", "Tai nghe Corsair HS80 MAX Wireless (Over-ear Gaming)", 3990000, 3490000, 15,
        {"Kiểu dáng": "Over-ear", "Kết nối": "SLIPSTREAM / Bluetooth / 3.5mm", "Microphone": "Omnidirectional", "Tần số đáp ứng": "20Hz - 40kHz", "Pin": "65 giờ"})
    add_product("Tai nghe", "HyperX", "Tai nghe HyperX Cloud III Có Dây", 1990000, 1790000, 20,
        {"Kiểu dáng": "Over-ear", "Kết nối": "USB-C / 3.5mm có dây", "Microphone": "Detachable", "Tần số đáp ứng": "10Hz - 21kHz", "Driver": "53mm"})

    # ═══════════════════════════════════════════════════════
    # 17. LOA
    # ═══════════════════════════════════════════════════════
    print("\n📂 LOA")
    add_product("Loa", "Edifier", "Loa Edifier R1280DBs Bluetooth Active Bookshelf 2.0", 2590000, 2290000, 15,
        {"Công suất": "42W (21W x 2)", "Kết nối": "Bluetooth 5.0 / Optical / RCA", "Kích thước": "Bookshelf 2.0"})
    add_product("Loa", "Creative", "Loa Creative Pebble V3 USB-C 2.0", 890000, None, 40,
        {"Công suất": "16W", "Kết nối": "USB-C / 3.5mm / Bluetooth 5.0", "Kích thước": "Desktop 2.0"})
    add_product("Loa", "JBL", "Loa JBL Quantum Duo Gaming 2.0 RGB", 2290000, 1990000, 20,
        {"Công suất": "20W (10W x 2)", "Kết nối": "USB / Bluetooth 5.0 / 3.5mm", "Kích thước": "Desktop 2.0", "LED": "RGB JBL QuantumSOUND"})
    add_product("Loa", "Creative", "Loa Creative Stage SE Soundbar 2.0", 1290000, 990000, 18,
        {"Công suất": "24W", "Kết nối": "Bluetooth 5.3 / USB / AUX 3.5mm", "Kích thước": "Soundbar dưới màn hình"})
    add_product("Loa", "Edifier", "Loa Edifier M3280BT Bluetooth 2.1", 1890000, 1690000, 15,
        {"Công suất": "36W (18W Sub + 9W x 2)", "Kết nối": "Bluetooth 5.1 / 3.5mm / USB", "Kích thước": "2.1 (Subwoofer + 2 vệ tinh)"})

    # ═══════════════════════════════════════════════════════
    # 18. WEBCAM
    # ═══════════════════════════════════════════════════════
    print("\n📂 WEBCAM")
    add_product("Webcam", "Logitech", "Webcam Logitech C922 Pro Stream 1080p", 1990000, 1790000, 20,
        {"Độ phân giải": "1080p 30fps / 720p 60fps", "Kết nối": "USB-A", "Microphone": "Dual Stereo Mic", "Tính năng": "Auto-focus, Low light correction"})
    add_product("Webcam", "Razer", "Webcam Razer Kiyo Pro Ultra 4K", 6990000, None, 8,
        {"Độ phân giải": "4K 30fps / 1080p 60fps", "Kết nối": "USB-C", "Microphone": "Omnidirectional", "Tính năng": "HDR, AI Noise Removal"})
    add_product("Webcam", "Elgato", "Webcam Elgato Facecam Pro 4K60", 8490000, 7990000, 6,
        {"Độ phân giải": "4K 60fps / 1080p 60fps", "Kết nối": "USB-C 3.0", "Microphone": "Không có mic", "Tính năng": "Sony STARVIS sensor, f/2.0"})
    add_product("Webcam", "Logitech", "Webcam Logitech C270 HD 720p", 590000, None, 50,
        {"Độ phân giải": "720p 30fps", "Kết nối": "USB-A", "Microphone": "Mono Mic", "Tính năng": "Fixed focus, clip mount"})

    # ═══════════════════════════════════════════════════════
    # 19. MICROPHONE
    # ═══════════════════════════════════════════════════════
    print("\n📂 MICROPHONE")
    add_product("Microphone", "HyperX", "Microphone HyperX QuadCast S USB RGB", 3290000, 2990000, 15,
        {"Kiểu": "Condenser", "Kết nối": "USB-C", "Hướng thu": "4 hướng (Stereo/Omni/Cardioid/Bidirectional)", "Tần số đáp ứng": "20Hz - 20kHz", "LED": "RGB tích hợp"})
    add_product("Microphone", "Razer", "Microphone Razer Seiren V3 Chroma USB", 2490000, None, 18,
        {"Kiểu": "Condenser", "Kết nối": "USB-C", "Hướng thu": "Supercardioid", "Tần số đáp ứng": "20Hz - 20kHz", "LED": "Razer Chroma RGB"})
    add_product("Microphone", "Elgato", "Microphone Elgato Wave:3 Premium USB Condenser", 3990000, 3690000, 10,
        {"Kiểu": "Condenser", "Kết nối": "USB-C", "Hướng thu": "Cardioid", "Tần số đáp ứng": "70Hz - 20kHz", "Bit depth": "24-bit / 96kHz"})

    # ═══════════════════════════════════════════════════════
    # 20. PHẦN MỀM, MẠNG
    # ═══════════════════════════════════════════════════════
    print("\n📂 PHẦN MỀM, MẠNG")
    add_product("Phần mềm, mạng", "ASUS", "Router Wifi 6 ASUS RT-AX86U Pro", 5990000, 5490000, 12,
        {"Chuẩn Wifi": "WiFi 6 (802.11ax)", "Tốc độ": "AX5700 (5700 Mbps)", "Số anten": "3 anten ngoài", "Cổng LAN": "1x 2.5G + 4x Gigabit"})
    add_product("Phần mềm, mạng", "TP-Link", "Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack)", 4290000, 3790000, 15,
        {"Chuẩn Wifi": "WiFi 6 (802.11ax)", "Tốc độ": "AX3000 (3000 Mbps)", "Phủ sóng": "600m² (3 thiết bị)", "Cổng LAN": "3x Gigabit mỗi unit"})
    add_product("Phần mềm, mạng", "Microsoft", "Microsoft Office 365 Personal (1 năm)", 1490000, None, 100,
        {"Loại": "Bản quyền số (Digital)", "Thời hạn": "1 năm", "Số thiết bị": "1 người dùng", "Dung lượng": "1TB OneDrive"})
    add_product("Phần mềm, mạng", "TP-Link", "Switch TP-Link TL-SG1005D 5 Port Gigabit", 290000, None, 40,
        {"Loại": "Switch mạng", "Số cổng": "5 Port Gigabit", "Tốc độ": "10/100/1000 Mbps", "Nguồn": "Adapter ngoài"})
    add_product("Phần mềm, mạng", "TP-Link", "USB Thu Wifi TP-Link Archer T3U Plus AC1300", 390000, None, 35,
        {"Loại": "USB Thu Wifi", "Chuẩn Wifi": "WiFi 5 AC1300 (802.11ac)", "Tốc độ": "867 + 400 Mbps", "Anten": "Anten ngoài xoay"})
    add_product("Phần mềm, mạng", "Microsoft", "Windows 11 Home 64-bit Bản quyền (OEM)", 3290000, None, 50,
        {"Loại": "Bản quyền Windows", "Phiên bản": "Windows 11 Home 64-bit", "Thời hạn": "Vĩnh viễn (OEM)", "Giao hàng": "Key + USB cài đặt"})
    add_product("Phần mềm, mạng", "Kaspersky", "Phần mềm Diệt Virus Kaspersky Plus 1 PC 1 Năm", 490000, 390000, 80,
        {"Loại": "Phần mềm Diệt Virus", "Số thiết bị": "1 PC", "Thời hạn": "1 năm", "Tính năng": "Antivirus + VPN + Privacy"})
    add_product("Phần mềm, mạng", "Adobe", "Adobe Creative Cloud All Apps 1 Năm (Đồ họa)", 14990000, None, 30,
        {"Loại": "Phần mềm Đồ họa", "Bao gồm": "Photoshop, Illustrator, Premiere Pro, After Effects...", "Thời hạn": "1 năm", "Số thiết bị": "2 thiết bị"})

    # ═══════════════════════════════════════════════════════
    # 21. HANDHELD, CONSOLE
    # ═══════════════════════════════════════════════════════
    print("\n📂 HANDHELD, CONSOLE")
    add_product("Handheld, Console", "Nintendo", "Nintendo Switch OLED Model Mario Red Edition", 8990000, None, 12,
        {"Màn hình": "7 inch OLED", "Dung lượng": "64GB", "Pin": "4.5 - 9 giờ", "Cổng": "USB-C, HDMI (Dock)"})
    add_product("Handheld, Console", "ASUS", "ASUS ROG Ally X Handheld Gaming", 19990000, 18990000, 8,
        {"CPU": "AMD Ryzen Z1 Extreme", "RAM": "24GB LPDDR5X", "Dung lượng": "1TB SSD", "Màn hình": "7 inch FHD 120Hz"})
    add_product("Handheld, Console", "Sony", "Máy chơi game Sony PlayStation 5 Slim (PS5 Slim)", 13990000, 12990000, 10,
        {"CPU": "AMD Zen 2 Custom 8-Core", "GPU": "AMD RDNA 2 Custom 10.28 TFLOPS", "Dung lượng": "1TB SSD", "Đĩa": "Có ổ đĩa Blu-ray"})
    add_product("Handheld, Console", "Microsoft", "Máy chơi game Xbox Series X 1TB", 12990000, None, 8,
        {"CPU": "AMD Zen 2 Custom 8-Core 3.8GHz", "GPU": "AMD RDNA 2 12 TFLOPS", "Dung lượng": "1TB SSD", "Đĩa": "Có ổ đĩa 4K UHD Blu-ray"})
    add_product("Handheld, Console", "Valve", "Máy chơi game Valve Steam Deck OLED 1TB", 15990000, None, 6,
        {"CPU": "AMD APU Zen 2 4-Core", "RAM": "16GB LPDDR5", "Dung lượng": "1TB NVMe SSD", "Màn hình": "7.4 inch OLED 90Hz HDR"})
    add_product("Handheld, Console", "Sony", "Tay cầm Sony DualSense Edge Wireless Controller (PS5)", 5490000, None, 15,
        {"Kết nối": "Bluetooth / USB-C", "Tương thích": "PS5 / PC", "Pin": "Tích hợp Li-Ion", "Tính năng": "Adaptive Trigger, Haptic Feedback, Back Buttons"})
    add_product("Handheld, Console", "Microsoft", "Tay cầm Xbox Wireless Controller Carbon Black", 1490000, 1290000, 25,
        {"Kết nối": "Bluetooth / USB-C / Xbox Wireless", "Tương thích": "Xbox / PC / Mobile", "Pin": "2x Pin AA", "Tính năng": "Textured Grip, Share Button"})
    add_product("Handheld, Console", "Logitech", "Tay cầm Logitech F310 Gamepad (PC)", 490000, None, 40,
        {"Kết nối": "USB có dây", "Tương thích": "PC / Android TV", "Layout": "Dual Analog + D-Pad"})
    add_product("Handheld, Console", "Thrustmaster", "Vô lăng đua xe Thrustmaster T248 Racing Wheel (PS/PC)", 6990000, 6490000, 6,
        {"Kết nối": "USB", "Tương thích": "PS5 / PS4 / PC", "Force Feedback": "Hybrid Drive (belt + gear)", "Góc xoay": "900°", "Pedals": "T3PM 3-pedal set"})
    add_product("Handheld, Console", "Sony", "Đĩa Game PS5 - God of War Ragnarok", 1490000, 990000, 20,
        {"Nền tảng": "PlayStation 5", "Thể loại": "Action-Adventure", "Nhà phát hành": "Santa Monica Studio / Sony", "Ngôn ngữ": "Phụ đề Tiếng Việt"})
    add_product("Handheld, Console", "Nintendo", "Đĩa Game Nintendo Switch - The Legend of Zelda: TotK", 1390000, None, 15,
        {"Nền tảng": "Nintendo Switch", "Thể loại": "Action-Adventure / Open World", "Nhà phát hành": "Nintendo", "Ngôn ngữ": "English / Japanese"})

    # ═══════════════════════════════════════════════════════
    # 22. PHỤ KIỆN
    # ═══════════════════════════════════════════════════════
    print("\n📂 PHỤ KIỆN")
    add_product("Phụ kiện", "ASUS", "Balo Laptop ASUS ROG Ranger BP2701 17 inch", 2290000, None, 20,
        {"Kích thước": "Laptop 17 inch", "Chất liệu": "Polyester chống nước", "Dung tích": "22L"})
    add_product("Phụ kiện", "Razer", "Hub USB-C Razer USB-C Dock 11-in-1", 3990000, 3490000, 12,
        {"Cổng": "4K HDMI, 3x USB-A 3.2, 2x USB-C, SD/MicroSD, Ethernet, 3.5mm", "Công suất PD": "85W USB-C PD Pass-through"})
    add_product("Phụ kiện", "NZXT", "Giá treo màn hình NZXT Manta Monitor Arm Single", 1890000, None, 15,
        {"Tải trọng": "2 - 9kg", "Kích thước màn hình": "17 - 34 inch", "VESA": "75x75 / 100x100mm"})
    add_product("Phụ kiện", "Samsung", "USB Samsung Bar Plus 256GB USB 3.1 400MB/s", 390000, None, 60,
        {"Dung lượng": "256GB", "Chuẩn kết nối": "USB 3.1 Gen 1", "Tốc độ đọc": "400 MB/s", "Chất liệu": "Kim loại chống nước"})
    add_product("Phụ kiện", "Cooler Master", "Đế tản nhiệt Laptop Cooler Master NotePal X-Slim II", 590000, 490000, 25,
        {"Tương thích": "Laptop 15.6 inch", "Fan": "1x 200mm Silent Fan", "Cổng USB": "1x USB 2.0 Pass-through", "Chất liệu": "Nhựa + Lưới thép"})
    add_product("Phụ kiện", "Anker", "Pin dự phòng Anker PowerCore III Elite 25600mAh 87W PD", 1890000, 1690000, 18,
        {"Dung lượng": "25600mAh", "Công suất": "87W USB-C PD", "Cổng": "1x USB-C PD + 2x USB-A", "Tính năng": "Sạc được Laptop qua USB-C"})
    add_product("Phụ kiện", "Anker", "Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m", 290000, None, 50,
        {"Chiều dài": "1.8m", "Công suất": "100W USB-C PD", "Chuẩn": "USB 2.0", "Chất liệu": "Nylon bện"})

    # ═══════════════════════════════════════════════════════
    # 23. DỊCH VỤ
    # ═══════════════════════════════════════════════════════
    print("\n📂 DỊCH VỤ")
    add_product("Dịch vụ", "EZ4GEAR", "Dịch vụ Cài đặt Windows + Driver + Phần mềm cơ bản", 200000, None, 999,
        {"Bao gồm": "Windows 11 + Driver + Office + Antivirus", "Thời gian": "30-60 phút", "Bảo hành": "1 tháng cài lại miễn phí"})
    add_product("Dịch vụ", "EZ4GEAR", "Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm", 990000, None, 999,
        {"Thời hạn": "2 năm (cộng thêm)", "Phạm vi": "Lỗi phần cứng, hỗ trợ kỹ thuật", "Ưu đãi": "1 đổi 1 trong 30 ngày đầu"})
    add_product("Dịch vụ", "EZ4GEAR", "Dịch vụ Vệ sinh PC / Laptop tại cửa hàng", 150000, None, 999,
        {"Bao gồm": "Vệ sinh bụi, thay keo tản nhiệt, kiểm tra phần cứng", "Thời gian": "30-45 phút", "Bảo hành": "Kiểm tra miễn phí sau 1 tuần"})
    add_product("Dịch vụ", "EZ4GEAR", "Dịch vụ Thu cũ đổi mới - Nâng cấp PC/Laptop", 0, None, 999,
        {"Bao gồm": "Định giá máy cũ, trừ vào máy mới", "Thời gian": "15-30 phút định giá", "Điều kiện": "Máy còn hoạt động, không hư hỏng nặng", "Ưu đãi": "Thu giá cao nhất thị trường"})

    # ═══════════════════════════════════════════════════════
    db.commit()

    total = db.query(Product).count()
    print("\n" + "=" * 60)
    print(f"✅ HOÀN TẤT! Tổng cộng {total} sản phẩm trong database.")
    print("=" * 60)

if __name__ == "__main__":
    run_seed_products()
    db.close()
