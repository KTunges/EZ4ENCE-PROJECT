import re
import uuid
import datetime

with open('backend/seed_db.py', 'r') as f:
    content = f.read()

now = datetime.datetime.now().isoformat()

# Add Brands
new_brands = [
    {"id": str(uuid.uuid4()), "name": "Logitech", "slug": "logitech"},
    {"id": str(uuid.uuid4()), "name": "Razer", "slug": "razer"},
    {"id": str(uuid.uuid4()), "name": "Akko", "slug": "akko"},
    {"id": str(uuid.uuid4()), "name": "HyperX", "slug": "hyperx"},
    {"id": str(uuid.uuid4()), "name": "Harman Kardon", "slug": "harman-kardon"},
    {"id": str(uuid.uuid4()), "name": "Lian Li", "slug": "lian-li"},
    {"id": str(uuid.uuid4()), "name": "Wooting", "slug": "wooting"},
]

brand_map = {b['name']: b['id'] for b in new_brands}

brands_str = ""
for b in new_brands:
    brands_str += f"""  {{
    "id": "{b['id']}",
    "name": "{b['name']}",
    "slug": "{b['slug']}",
    "description": "",
    "logo": "",
    "created_at": "{now}",
    "updated_at": "{now}"
  }},\n"""

content = content.replace("BRANDS_DATA = [", f"BRANDS_DATA = [\n{brands_str}")

# Extract category IDs based on slug instead of name
cat_slug_map = {}
for match in re.finditer(r'"id":\s*"([^"]+)",\s*"name":\s*"[^"]+",\s*"slug":\s*"([^"]+)"', content):
    cat_slug_map[match.group(2)] = match.group(1)

# Add Products
new_prods = [
    {
        "name": "Chuột Logitech G Pro X Superlight",
        "slug": "logitech-g-pro-x-superlight",
        "brand_name": "Logitech",
        "category_slug": "chuot",
        "price": 2500000,
        "desc": "Chuột không dây siêu nhẹ cho game thủ",
        "specs": {"Kết nối": "Không dây Lightspeed", "DPI": "25000", "Trọng lượng": "63g"}
    },
    {
        "name": "Chuột Razer DeathAdder V3 Pro",
        "slug": "razer-deathadder-v3-pro",
        "brand_name": "Razer",
        "category_slug": "chuot-gaming",
        "price": 3200000,
        "desc": "Chuột gaming công thái học cao cấp",
        "specs": {"Kết nối": "Không dây Hyperspeed", "DPI": "30000", "Trọng lượng": "63g"}
    },
    {
        "name": "Bàn phím cơ Akko MOD007 PC",
        "slug": "akko-mod007-pc",
        "brand_name": "Akko",
        "category_slug": "bàn-phím",
        "price": 1800000,
        "desc": "Bàn phím cơ custom giá rẻ",
        "specs": {"Loại Switch": "Akko CS", "Kích thước": "TKL", "Kết nối": "Có dây"}
    },
    {
        "name": "Bàn phím Wooting 60HE",
        "slug": "wooting-60he",
        "brand_name": "Wooting",
        "category_slug": "bàn-phím",
        "price": 4500000,
        "desc": "Bàn phím analog tốt nhất thế giới",
        "specs": {"Loại Switch": "Lekker", "Kích thước": "60%", "Kết nối": "Có dây"}
    },
    {
        "name": "Tai nghe HyperX Cloud III",
        "slug": "hyperx-cloud-iii",
        "brand_name": "HyperX",
        "category_slug": "tai-nghe",
        "price": 2200000,
        "desc": "Tai nghe gaming thoải mái nhất",
        "specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
    },
    {
        "name": "Tai nghe Razer BlackShark V2",
        "slug": "razer-blackshark-v2-mock",
        "brand_name": "Razer",
        "category_slug": "tai-nghe",
        "price": 2500000,
        "desc": "Tai nghe e-sports chuyên nghiệp",
        "specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
    },
    {
        "name": "Vỏ Case Lian Li O11 Dynamic EVO",
        "slug": "lian-li-o11-dynamic-evo",
        "brand_name": "Lian Li",
        "category_slug": "case",
        "price": 3800000,
        "desc": "Vỏ case bể cá huyền thoại",
        "specs": {"Kích thước": "Mid Tower", "Màu sắc": "Trắng", "Chất liệu": "Nhôm, Kính cường lực"}
    },
    {
        "name": "Loa Harman Kardon SoundSticks 4",
        "slug": "harman-kardon-soundsticks-4",
        "brand_name": "Harman Kardon",
        "category_slug": "loa",
        "price": 6500000,
        "desc": "Loa bluetooth thiết kế trong suốt",
        "specs": {"Kết nối": "Bluetooth", "Công suất": "140W", "Màu sắc": "Trắng"}
    }
]

import json

prods_str = ""
for p in new_prods:
    pid = str(uuid.uuid4())
    bid = brand_map.get(p['brand_name'], 'null')
    if bid != 'null': bid = f'"{bid}"'
    cid = cat_slug_map.get(p['category_slug'], 'null')
    if cid != 'null': cid = f'"{cid}"'
    
    prods_str += f"""  {{
    "id": "{pid}",
    "name": "{p['name']}",
    "slug": "{p['slug']}",
    "description": "{p['desc']}",
    "category_id": {cid},
    "brand_id": {bid},
    "base_price": {p['price']},
    "is_published": True,
    "created_at": "{now}",
    "updated_at": "{now}",
    "full_specs": {json.dumps(p['specs'], ensure_ascii=False)}
  }},\n"""

content = content.replace("PRODUCTS_DATA = [", f"PRODUCTS_DATA = [\n{prods_str}")

with open('backend/seed_db.py', 'w') as f:
    f.write(content)
print("Done rewriting seed_db.py")
