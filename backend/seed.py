import sys
import os
import uuid

# Thêm đường dẫn backend vào sys.path để import app
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models.category import Category
from app.models.product import Product, ProductSKU, ProductImage
import random
from textwrap import dedent

def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text).strip('-')

def seed_products():
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    
    # Map category names to IDs
    categories = db.query(Category).all()
    cat_map = {c.name: c.id for c in categories}
    
    # Helper to find category ID
    def get_cat_id(names):
        for name in names:
            if name in cat_map:
                return cat_map[name]
        return categories[0].id if categories else None

    # Danh sách 22 sản phẩm chuẩn Spec cho mọi danh mục
    products_data = [
        # --- 4. Main, CPU, VGA ---
        {
            "name": "CPU Intel Core i9-14900K",
            "cat": ["Main, CPU, VGA"],
            "price": 15500000,
            "promo": 14725000,
            "desc": "Bộ vi xử lý flagship thế hệ 14 của Intel với 24 nhân, 32 luồng, xung nhịp lên đến 6.0GHz cho hiệu năng vô song trong gaming và sáng tạo.",
            "specs": {"Socket": "Intel LGA 1700", "Số nhân": "24 (8P+16E)", "Số luồng": "32", "Xung tối đa": "6.0 GHz", "TDP": "253W"}
        },
        {
            "name": "Card Màn Hình ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB",
            "cat": ["Main, CPU, VGA"],
            "price": 58990000,
            "promo": None,
            "desc": "Cỗ máy đồ hoạ tối thượng với kiến trúc Ada Lovelace, thiết kế tản nhiệt khổng lồ, LED RGB cực đỉnh dành cho game thủ hardcore.",
            "specs": {"GPU": "NVIDIA RTX 4090", "VRAM": "24GB GDDR6X", "CUDA Cores": "16384", "Nguồn đề xuất": "1000W"}
        },
        {
            "name": "Mainboard GIGABYTE Z790 AORUS ELITE AX",
            "cat": ["Main, CPU, VGA"],
            "price": 7500000,
            "promo": 6750000,
            "desc": "Bo mạch chủ chipset Z790 cao cấp, hỗ trợ DDR5, PCIe 5.0, Wi-Fi 6E cùng dàn VRM mạnh mẽ cân tốt các CPU i7/i9 thế hệ mới.",
            "specs": {"Chipset": "Intel Z790", "Socket": "LGA 1700", "RAM Hỗ trợ": "4x DDR5 (Max 192GB)", "Kết nối": "Wi-Fi 6E, 2.5GbE LAN"}
        },
        
        # --- 5. Case, Nguồn, Tản ---
        {
            "name": "Case NZXT H9 Flow Dual-Chamber ATX Mid-Tower (Đen)",
            "cat": ["Case, Nguồn, Tản"],
            "price": 4290000,
            "promo": None,
            "desc": "Vỏ case thiết kế hồ cá với 2 mặt kính liền mạch, buồng nguồn ẩn phía sau giúp tối ưu hoá luồng khí và không gian trưng bày linh kiện.",
            "specs": {"Loại case": "Mid-Tower", "Hỗ trợ Main": "Mini-ITX, Micro-ATX, ATX", "Mặt kính": "Kính cường lực trước và hông"}
        },
        {
            "name": "Nguồn máy tính Corsair RM1000x Shift 80 PLUS Gold",
            "cat": ["Case, Nguồn, Tản"],
            "price": 4990000,
            "promo": None,
            "desc": "Nguồn ATX 3.0 với thiết kế cổng cắm dây chuyển sang mặt hông độc đáo, cáp Type-IV micro-fit và chuẩn PCIe 5.0.",
            "specs": {"Công suất": "1000W", "Chứng nhận": "80 PLUS Gold", "Chuẩn": "ATX 3.0 & PCIe 5.0", "Cáp": "Fully Modular"}
        },
        {
            "name": "Tản nhiệt nước NZXT Kraken Elite 360 RGB",
            "cat": ["Case, Nguồn, Tản"],
            "price": 7490000,
            "promo": 7115500,
            "desc": "Tản AIO cao cấp với màn hình LCD 60Hz cực mượt, bơm Asetek Gen 7 và 3 quạt F120 RGB Core cực êm.",
            "specs": {"Kích thước Rad": "360mm", "Màn hình": "LCD 2.36 inch 640x640", "Tốc độ quạt": "500-1800 RPM", "Socket": "LGA 1700 / AM5"}
        },
        
        # --- 6. Ổ cứng, RAM ---
        {
            "name": "RAM Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz",
            "cat": ["Ổ cứng, RAM"],
            "price": 8500000,
            "promo": 7990000,
            "desc": "Kit RAM DDR5 đỉnh cao với top bar thay thế được, LED RGB capellix siêu sáng, hiệu năng ép xung vượt trội.",
            "specs": {"Dung lượng": "64GB (2x32GB)", "Loại RAM": "DDR5", "Bus": "6000 MHz", "Độ trễ": "CL30"}
        },
        {
            "name": "Ổ cứng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 x4 NVMe",
            "cat": ["Ổ cứng, RAM"],
            "price": 4890000,
            "promo": None,
            "desc": "Ổ SSD NVMe tốc độ chạm đỉnh PCIe 4.0, giải pháp lưu trữ hoàn hảo cho game thủ và chuyên gia sáng tạo.",
            "specs": {"Dung lượng": "2TB", "Chuẩn giao tiếp": "PCIe Gen 4.0 x4", "Tốc độ Đọc": "Lên tới 7,450 MB/s", "Tốc độ Ghi": "Lên tới 6,900 MB/s"}
        },
        
        # --- 7. Loa, Webcam ---
        {
            "name": "Loa Máy Tính Logitech G560 LIGHTSYNC PC Gaming",
            "cat": ["Loa, Webcam"],
            "price": 4990000,
            "promo": 4241500,
            "desc": "Hệ thống loa 2.1 với âm trầm uy lực và công nghệ LIGHTSYNC RGB đồng bộ ánh sáng với màn hình chơi game.",
            "specs": {"Hệ thống": "2.1", "Công suất Đỉnh": "240W", "Công suất RMS": "120W", "Kết nối": "Bluetooth, USB, 3.5mm"}
        },
        {
            "name": "Webcam Logitech Brio 4K Ultra HD",
            "cat": ["Loa, Webcam"],
            "price": 4500000,
            "promo": None,
            "desc": "Webcam tốt nhất thế giới dành cho streaming và hội nghị với độ phân giải 4K, HDR và hỗ trợ nhận diện khuôn mặt Windows Hello.",
            "specs": {"Độ phân giải": "4K/30fps, 1080p/60fps", "Tính năng": "HDR, RightLight 3, Windows Hello", "Góc nhìn (FOV)": "65°, 78°, 90°"}
        },

        # --- 8. Màn hình ---
        {
            "name": "Màn hình LG UltraGear 27GR95QE-B 27 inch OLED 240Hz",
            "cat": ["Màn hình"],
            "price": 21900000,
            "promo": 19900000,
            "desc": "Trải nghiệm hình ảnh hoàn hảo với tấm nền OLED, độ phản hồi cực nhanh 0.03ms và tần số quét 240Hz chuẩn eSports.",
            "specs": {"Kích thước": "27 inch", "Độ phân giải": "QHD (2560x1440)", "Tấm nền": "OLED", "Tần số quét": "240Hz", "Phản hồi": "0.03ms"}
        },
        {
            "name": "Màn hình ASUS ROG Swift 360Hz PG259QN",
            "cat": ["Màn hình"],
            "price": 14990000,
            "promo": None,
            "desc": "Màn hình eSports tối thượng với tần số quét 360Hz siêu nhanh, NVIDIA G-SYNC tích hợp giúp triệt tiêu hoàn toàn độ trễ.",
            "specs": {"Kích thước": "24.5 inch", "Độ phân giải": "FHD (1920x1080)", "Tấm nền": "Fast IPS", "Tần số quét": "360Hz", "Phản hồi": "1ms"}
        },

        # --- 9. Bàn phím ---
        {
            "name": "Bàn phím cơ Corsair K70 RGB PRO Cherry MX Red",
            "cat": ["Bàn phím"],
            "price": 3890000,
            "promo": 3490000,
            "desc": "Bàn phím cơ full-size khung nhôm phay xước huyền thoại, sử dụng switch Cherry MX cao cấp và công nghệ AXON cho tốc độ phản hồi 8000Hz.",
            "specs": {"Loại phím": "Cơ (Mechanical)", "Switch": "Cherry MX Red", "Polling Rate": "8000Hz (AXON)", "Kết nối": "Dây cáp bọc dù tháo rời"}
        },
        {
            "name": "Bàn phím cơ Razer Huntsman V2 Analog",
            "cat": ["Bàn phím"],
            "price": 6490000,
            "promo": 5990000,
            "desc": "Bàn phím quang học Analog với khả năng tuỳ chỉnh điểm nhận phím, mang lại trải nghiệm điều khiển như cần gạt gamepad.",
            "specs": {"Loại phím": "Quang học (Optical)", "Switch": "Razer Analog Optical", "Tính năng": "Tuỳ chỉnh điểm kích hoạt, Actuation siêu nhạy", "Kê tay": "Kê tay nam châm da PU"}
        },

        # --- 10. Chuột + Lót chuột ---
        {
            "name": "Chuột Không Dây Logitech G Pro X Superlight 2 (Đen)",
            "cat": ["Chuột + Lót chuột"],
            "price": 3790000,
            "promo": 3490000,
            "desc": "Chuột eSports nhẹ nhất thế giới nay đã được nâng cấp với switch quang học LIGHTFORCE và cảm biến HERO 2 độ chính xác siêu cao.",
            "specs": {"Trọng lượng": "Dưới 60g", "Cảm biến": "HERO 2", "DPI Tối đa": "32000 DPI", "Kết nối": "Không dây LIGHTSPEED (Type-C)"}
        },
        {
            "name": "Lót chuột Razer Gigantus V2 - XXL",
            "cat": ["Chuột + Lót chuột"],
            "price": 890000,
            "promo": None,
            "desc": "Lót chuột vải bề mặt vi mô mang lại độ mượt tuyệt đối, kích thước XXL phủ kín mặt bàn làm việc.",
            "specs": {"Kích thước": "XXL (940 x 410 x 4 mm)", "Bề mặt": "Vải sợi dệt vi mô", "Đế": "Cao su chống trượt dập vân"}
        },

        # --- 11. Tai Nghe ---
        {
            "name": "Tai nghe HyperX Cloud III Wireless",
            "cat": ["Tai Nghe"],
            "price": 4290000,
            "promo": 3990000,
            "desc": "Sự kế thừa huyền thoại với màng loa 53mm góc nghiêng, đệm tai memory foam siêu êm và pin siêu trâu 120 giờ.",
            "specs": {"Kết nối": "Không dây 2.4GHz", "Màng loa": "53mm có góc nghiêng", "Mic": "Khử ồn 10mm (Tháo rời)", "Thời lượng pin": "Lên đến 120 giờ"}
        },

        # --- 12. Phần mềm, mạng ---
        {
            "name": "Hệ điều hành Windows 11 Pro (Bản Quyền Digital)",
            "cat": ["Phần mềm, mạng"],
            "price": 4500000,
            "promo": 3990000,
            "desc": "Bản quyền Windows 11 Pro chính hãng tích hợp sẵn các tính năng bảo mật doanh nghiệp và BitLocker.",
            "specs": {"Loại phần mềm": "Hệ điều hành", "Hình thức": "Key điện tử (Digital)", "Số thiết bị": "1 PC", "Hạn dùng": "Vĩnh viễn theo mainboard"}
        },
        {
            "name": "Router Wi-Fi 6 ASUS RT-AX82U v2 Chuẩn Gaming",
            "cat": ["Phần mềm, mạng"],
            "price": 4990000,
            "promo": 4490000,
            "desc": "Router Wi-Fi 6 băng tần kép chuẩn AX5400 với công nghệ Aura RGB, tối ưu hóa độ trễ cho Mobile Gaming.",
            "specs": {"Chuẩn mạng": "Wi-Fi 6 (802.11ax)", "Tốc độ": "AX5400 (4804Mbps 5GHz + 574Mbps 2.4GHz)", "Antenna": "4 ăng-ten rời", "Tính năng": "Cổng Mobile Game, AiMesh"}
        },

        # --- 13. Handheld, Console ---
        {
            "name": "Máy chơi game Valve Steam Deck OLED 512GB",
            "cat": ["Handheld, Console"],
            "price": 16990000,
            "promo": 15990000,
            "desc": "Phiên bản OLED tuyệt đẹp của Steam Deck với pin trâu hơn, màn hình HDR rực rỡ và Wi-Fi 6E siêu tốc.",
            "specs": {"Màn hình": "7.4 inch OLED HDR 90Hz", "APU": "AMD Zen 2 + RDNA 2 (6nm)", "RAM": "16GB LPDDR5", "Lưu trữ": "512GB NVMe SSD"}
        },
        {
            "name": "Máy chơi game Sony PlayStation 5 (PS5) Slim Standard",
            "cat": ["Handheld, Console"],
            "price": 14990000,
            "promo": 13990000,
            "desc": "Hệ máy console thế hệ mới thiết kế mỏng nhẹ hơn (Slim), ổ cứng 1TB, trải nghiệm 4K HDR và tay cầm DualSense chân thực.",
            "specs": {"Ổ đĩa": "Có (Standard Edition)", "Đồ hoạ": "AMD Radeon RDNA 2", "Lưu trữ": "1TB Custom SSD", "Tính năng": "Ray Tracing, 3D Audio"}
        },

        # --- 14. Phụ kiện ---
        {
            "name": "Giá treo tai nghe Razer Base Station V2 Chroma",
            "cat": ["Phụ kiện"],
            "price": 1890000,
            "promo": 1690000,
            "desc": "Giá treo tai nghe kiêm USB Hub tích hợp âm thanh vòm 7.1 và dải đèn LED Razer Chroma đồng bộ rực rỡ.",
            "specs": {"Chất liệu": "Hợp kim nhôm", "Kết nối": "2x USB 3.1, 1x Audio 3.5mm combo", "Đèn LED": "Razer Chroma RGB", "Chiều cao": "278mm"}
        },

        # --- 15. Dịch vụ khác ---
        {
            "name": "Dịch Vụ Vệ Sinh Bảo Dưỡng PC Trọn Gói",
            "cat": ["Dịch vụ khác"],
            "price": 250000,
            "promo": None,
            "desc": "Dịch vụ vệ sinh toàn bộ máy tính, thổi bụi, lau kính case, tra lại keo tản nhiệt CPU/VGA cao cấp.",
            "specs": {"Thời gian thực hiện": "30-45 Phút", "Vật tư sử dụng": "Keo tản nhiệt Thermal Grizzly Kryonaut, Khí nén chuyên dụng", "Bảo hành": "Đảm bảo nhiệt độ giảm 5-10 độ"}
        }
    ]

    count = 0
    for p_data in products_data:
        cat_id = get_cat_id(p_data["cat"])
        # Tạo slug độc nhất
        slug = slugify(p_data["name"])
        # Nếu đã tồn tại thì bỏ qua
        if db.query(Product).filter(Product.slug == slug).first():
            continue
            
        product = Product(
            id=str(uuid.uuid4()),
            name=p_data["name"],
            slug=slug,
            description=p_data["desc"],
            category_id=cat_id,
            specifications=p_data["specs"]
        )
        db.add(product)
        
        # Thêm SKU
        sku_code = "SKU-" + str(uuid.uuid4())[:8].upper()
        sku = ProductSKU(
            id=str(uuid.uuid4()),
            product_id=product.id,
            sku_code=sku_code,
            price=p_data["price"],
            promotional_price=p_data["promo"],
            stock_quantity=random.randint(5, 50),
            attributes={"Phiên bản": "Mặc định"}
        )
        db.add(sku)
        
        # Thêm ảnh Placeholder
        cat_name_for_placeholder = p_data["cat"][0].replace(" ", "+")
        img_url = f"https://via.placeholder.com/600/1a1a2e/00d2ff?text={cat_name_for_placeholder}"
        img = ProductImage(
            id=str(uuid.uuid4()),
            product_id=product.id,
            url=img_url,
            is_primary=True
        )
        db.add(img)
        count += 1
        
    db.commit()
    print(f"Đã seed thành công {count} sản phẩm mới.")

if __name__ == "__main__":
    seed_products()
