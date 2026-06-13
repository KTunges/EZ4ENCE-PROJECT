import sys
sys.stdout.reconfigure(encoding="utf-8")
import asyncio
import os
import sys
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.category import Category
from app.models.brand import Brand
from app.models.product import Product, ProductSKU, ProductImage
from app.models.user import User, Role

def seed():
    db: Session = SessionLocal()
    try:
        print("Starting seed database...")
        
        # 1. Seed User Admin
        admin_email = "admin@ez4ence.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                email=admin_email,
                password="hashed_password_here",
                full_name="Administrator",
                role=Role.ADMIN,
                is_active=True
            )
            db.add(admin_user)

        # 2. Seed Categories (Matching frontend Sidebar exactly)
        categories_data = [
            {"name": "Laptop", "slug": "Laptop", "description": "Laptops văn phòng, mỏng nhẹ, doanh nhân"},
            {"name": "Laptop Gaming", "slug": "Laptop Gaming", "description": "Laptop chơi game hiệu năng cao"},
            {"name": "PC EZ4ENCE", "slug": "PC", "description": "Máy tính để bàn lắp ráp sẵn"},
            {"name": "Main, CPU, VGA", "slug": "Mainboard", "description": "Linh kiện PC cơ bản"},
            {"name": "Case, Nguồn, Tản", "slug": "Case", "description": "Vỏ máy, nguồn và tản nhiệt"},
            {"name": "Ổ cứng, RAM", "slug": "RAM", "description": "Bộ nhớ trong và lưu trữ"},
            {"name": "Màn hình", "slug": "Màn hình", "description": "Màn hình máy tính chuyên nghiệp và gaming"},
            {"name": "Chuột + Lót chuột", "slug": "Chuột", "description": "Chuột và lót chuột gaming"},
            {"name": "Bàn phím", "slug": "Bàn phím", "description": "Bàn phím cơ và văn phòng"},
            {"name": "Tai Nghe", "slug": "Tai nghe", "description": "Tai nghe gaming, studio"},
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
        for c in category_objects.values():
            db.refresh(c)

        # 3. Seed Brands
        brands_data = [
            {"name": "ASUS", "slug": "asus"},
            {"name": "MSI", "slug": "msi"},
            {"name": "Lenovo", "slug": "lenovo"},
            {"name": "Acer", "slug": "acer"},
            {"name": "Dell", "slug": "dell"},
            {"name": "HP", "slug": "hp"},
            {"name": "Apple", "slug": "apple"},
            {"name": "Corsair", "slug": "corsair"},
            {"name": "NZXT", "slug": "nzxt"},
            {"name": "Deepcool", "slug": "deepcool"},
            {"name": "Logitech", "slug": "logitech"},
            {"name": "HyperX", "slug": "hyperx"},
            {"name": "Razer", "slug": "razer"},
            {"name": "SteelSeries", "slug": "steelseries"}

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
        for b in brand_objects.values():
            db.refresh(b)

        # 4. Seed Products (10 Laptops with detailed specs and multiple images)
        products_data = [
            {
                "name": "Laptop Gaming ASUS ROG Strix G16 G614JV",
                "slug": "asus-rog-strix-g16-g614jv",
                "price": 32490000,
                "promotional_price": 34990000,
                "stock": 15,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["asus"].id,
                "description": "ASUS ROG Strix G16 mang đến hiệu năng đỉnh cao với CPU Intel Core i7 thế hệ 13 và GPU NVIDIA GeForce RTX 4060. Hệ thống tản nhiệt thông minh ROG Intelligent Cooling giúp duy trì nhiệt độ tối ưu, đảm bảo hiệu suất chơi game mượt mà không bị gián đoạn.",
                "specs": {"CPU": "Intel Core i7-13650HX", "RAM": "16GB DDR5 4800MHz", "SSD": "512GB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4060 8GB", "Màn hình": "16 inch FHD+ (1920 x 1200) 165Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284416/ez4ence/products/ryopp3xyapdt85rkinml.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284417/ez4ence/products/wqkknlqjrlojerrfu0n3.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284418/ez4ence/products/wcezvzfyhysihoqnkd9h.png"
                ]
            },
            {
                "name": "Laptop Gaming MSI Katana 15 B13VGK",
                "slug": "msi-katana-15-b13vgk",
                "price": 36990000,
                "promotional_price": 38990000,
                "stock": 20,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["msi"].id,
                "description": "Được rèn giũa như một lưỡi kiếm Katana thực thụ, MSI Katana 15 trang bị cấu hình siêu khủng với RTX 4070 cùng bộ vi xử lý Intel Core i7 thế hệ 13, mang đến trải nghiệm đồ họa tuyệt vời cho game thủ và nhà sáng tạo nội dung.",
                "specs": {"CPU": "Intel Core i7-13620H", "RAM": "16GB DDR5", "SSD": "1TB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4070 8GB", "Màn hình": "15.6 inch FHD IPS 144Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284420/ez4ence/products/ayuw4pwsbrosbufvurg0.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284422/ez4ence/products/fj1gttwvql6wk9xjq57o.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284421/ez4ence/products/qdt9agd6yeasc0tb1v60.png"
                ]
            },
            {
                "name": "Laptop Gaming Lenovo Legion 5 16IRX9",
                "slug": "lenovo-legion-5-16irx9",
                "price": 39990000,
                "promotional_price": 42990000,
                "stock": 10,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["lenovo"].id,
                "description": "Lenovo Legion 5 - Biểu tượng của sự hoàn hảo trong phân khúc gaming. Thiết kế tinh tế, build nhôm nguyên khối, kết hợp với sức mạnh từ cấu hình mới nhất và màn hình 2K siêu nét chuẩn màu.",
                "specs": {"CPU": "Intel Core i7-14650HX", "RAM": "32GB DDR5 5600MHz", "SSD": "1TB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4060 8GB", "Màn hình": "16 inch WQXGA (2560x1600) 165Hz 100% sRGB"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284424/ez4ence/products/ctn6meovbvunz7l3aus3.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284426/ez4ence/products/jgz6mvmh0olafiaedheo.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284428/ez4ence/products/xzw5mwixfob4j3tiwa0s.png"
                ]
            },
            {
                "name": "Laptop Gaming Acer Nitro 16 Phoenix",
                "slug": "acer-nitro-16-phoenix",
                "price": 26990000,
                "promotional_price": 29990000,
                "stock": 30,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["acer"].id,
                "description": "Phiên bản Phoenix với logo hoàn toàn mới. Máy trang bị tản nhiệt tối tân với kem tản nhiệt kim loại lỏng, CPU AMD Ryzen 7 7840HS mát mẻ và card đồ họa RTX 4050.",
                "specs": {"CPU": "AMD Ryzen 7 7840HS", "RAM": "16GB DDR5 5600MHz", "SSD": "512GB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4050 6GB", "Màn hình": "16 inch WUXGA (1920x1200) 165Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308490/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-1.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308492/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-2.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307973/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-3.webp"
                ]
            },
            {
                "name": "Laptop Gaming ASUS TUF Gaming A15",
                "slug": "asus-tuf-gaming-a15",
                "price": 25490000,
                "promotional_price": 27990000,
                "stock": 25,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["asus"].id,
                "description": "Bền bỉ chuẩn quân đội MIL-STD-810H. Thiết kế góc cạnh mạnh mẽ, viên pin dung lượng lớn 90Wh cùng cấu hình RTX thế hệ 40 series cho khả năng chiến game AAA ở mức thiết lập cao.",
                "specs": {"CPU": "AMD Ryzen 7 8845HS", "RAM": "16GB DDR5 5600MHz", "SSD": "512GB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4060 8GB", "Màn hình": "15.6 inch FHD IPS 144Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288012/ez4ence/products/lkdccv6b3bqvek2av7vj.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288013/ez4ence/products/seksjroyemqbsqibk0ln.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288014/ez4ence/products/mhebrgub95vwlgk3rhi1.jpg"
                ]
            },
            {
                "name": "Apple MacBook Pro 14 M3",
                "slug": "apple-macbook-pro-14-m3",
                "price": 37490000,
                "promotional_price": 39990000,
                "stock": 12,
                "category_id": category_objects["Laptop"].id,
                "brand_id": brand_objects["apple"].id,
                "description": "Siêu phẩm máy tính xách tay cao cấp dành cho dân sáng tạo nội dung, lập trình viên. Chip M3 mang đến hiệu suất vượt trội cùng thời lượng pin lên đến 22 giờ. Màn hình Liquid Retina XDR đẹp xuất sắc.",
                "specs": {"CPU": "Apple M3 8-Core", "RAM": "8GB Unified Memory", "SSD": "512GB SSD", "VGA": "Apple M3 10-Core GPU", "Màn hình": "14.2 inch Liquid Retina XDR display (3024x1964)"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284392/ez4ence/products/pmyficun6fgoxcgvryn3.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284394/ez4ence/products/hjgofuycpkx5ebxpdrlt.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284396/ez4ence/products/dvmfrohrj3trkuktdolz.jpg"
                ]
            },
            {
                "name": "Laptop Dell XPS 13 9340",
                "slug": "dell-xps-13-9340",
                "price": 47990000,
                "promotional_price": 49990000,
                "stock": 5,
                "category_id": category_objects["Laptop"].id,
                "brand_id": brand_objects["dell"].id,
                "description": "Thiết kế tối giản thời thượng với nhôm cắt CNC nguyên khối, bàn phím tràn viền và thanh touchbar cảm ứng lực độc đáo. XPS 13 là biểu tượng của doanh nhân thành đạt.",
                "specs": {"CPU": "Intel Core Ultra 7 155H", "RAM": "16GB LPDDR5X", "SSD": "512GB PCIe Gen4", "VGA": "Intel Arc Graphics", "Màn hình": "13.4 inch FHD+ (1920x1200) Touch"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307047/ez4ence/products/dmxa5a43ia62lvmwywmx.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307048/ez4ence/products/wsrecc70jj48motebdff.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307048/ez4ence/products/zyyohqkdid6gmtne2orj.jpg"
                ]
            },
            {
                "name": "Laptop Gaming HP Victus 16-r0129TX",
                "slug": "hp-victus-16-r0129tx",
                "price": 24990000,
                "promotional_price": 26990000,
                "stock": 20,
                "category_id": category_objects["Laptop Gaming"].id,
                "brand_id": brand_objects["hp"].id,
                "description": "Mang dáng vẻ thanh lịch không quá hầm hố, HP Victus 16 phù hợp cho cả nhu cầu học tập, làm việc văn phòng lẫn trải nghiệm gaming giải trí đỉnh cao nhờ card rời RTX 4050.",
                "specs": {"CPU": "Intel Core i5-13500H", "RAM": "16GB DDR5 5200MHz", "SSD": "512GB PCIe Gen4", "VGA": "NVIDIA GeForce RTX 4050 6GB", "Màn hình": "16.1 inch FHD IPS 144Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307044/ez4ence/products/upzgv5spgsxxiknhozoy.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307045/ez4ence/products/n05af8villxbxofqxkui.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307046/ez4ence/products/lvuhgs4jb0rkqzzzubmr.jpg"
                ]
            },
            {
                "name": "Laptop Lenovo IdeaPad Slim 5 14IMH9",
                "slug": "lenovo-ideapad-slim-5-14imh9",
                "price": 18490000,
                "promotional_price": 19990000,
                "stock": 40,
                "category_id": category_objects["Laptop"].id,
                "brand_id": brand_objects["lenovo"].id,
                "description": "Chiếc máy văn phòng hoàn hảo với màn hình OLED hiển thị màu sắc rực rỡ chuẩn điện ảnh. Thiết kế vỏ nhôm siêu mỏng nhẹ cùng chip Intel Core Ultra tích hợp NPU xử lý AI tiên tiến.",
                "specs": {"CPU": "Intel Core Ultra 5 125H", "RAM": "16GB LPDDR5X", "SSD": "512GB PCIe Gen4", "VGA": "Intel Arc Graphics", "Màn hình": "14 inch WUXGA (1920x1200) OLED 100% DCI-P3"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288268/ez4ence/products/jc45zhjqfukj6jxco4ia.webp",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288269/ez4ence/products/jebsdoeiijlzjccqprqm.webp",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288269/ez4ence/products/liaimbiic6kf98n7l7dh.webp"
                ]
            },
            {
                "name": "Laptop ASUS Zenbook 14 OLED UX3405MA",
                "slug": "asus-zenbook-14-oled-ux3405ma",
                "price": 27490000,
                "promotional_price": 28990000,
                "stock": 18,
                "category_id": category_objects["Laptop"].id,
                "brand_id": brand_objects["asus"].id,
                "description": "ASUS Zenbook 14 OLED nổi bật với sự mỏng nhẹ phi thường, nặng chỉ 1.2kg. Màn hình Lumina OLED 3K 120Hz siêu sắc nét đem lại trải nghiệm thị giác rực rỡ và chân thực đến kinh ngạc.",
                "specs": {"CPU": "Intel Core Ultra 7 155H", "RAM": "16GB LPDDR5X", "SSD": "1TB PCIe Gen4", "VGA": "Intel Arc Graphics", "Màn hình": "14 inch 3K (2880 x 1800) OLED 120Hz"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288271/ez4ence/products/tr6ziddjpqleyem2drge.webp",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288272/ez4ence/products/apgaarf5ovixlrqivg8c.webp",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288274/ez4ence/products/jfkf42irnbwvol7kbysh.webp"
                ]
            }
        ,
            {
                "name": "Case Corsair 4000D Airflow",
                "slug": "case-corsair-4000d-airflow",
                "price": 2190000,
                "promotional_price": 1990000,
                "stock": 10,
                "category_id": category_objects["Case"].id,
                "brand_id": brand_objects["corsair"].id,
                "description": "Case Corsair 4000D Airflow là một chiếc case ATX mid-tower hoàn hảo với luồng không khí mạnh mẽ và khả năng làm mát xuất sắc, đi kèm mặt trước được thiết kế dạng lưới tối ưu tản nhiệt.",
                "specs": {"Loại": "Mid Tower", "Màu sắc": "Đen/Trắng", "Hỗ trợ Mainboard": "ATX, Micro-ATX, Mini-ITX", "Cổng kết nối": "USB 3.0, Type-C"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338885/ez4ence/products/case-corsair-4000d-airflow-1.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338886/ez4ence/products/case-corsair-4000d-airflow-2.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338886/ez4ence/products/case-corsair-4000d-airflow-3.jpg"
                ]
            },
            {
                "name": "Nguồn Corsair RM850e 850W",
                "slug": "nguon-corsair-rm850e-850w",
                "price": 3150000,
                "promotional_price": 2890000,
                "stock": 15,
                "category_id": category_objects["Case"].id,
                "brand_id": brand_objects["corsair"].id,
                "description": "Nguồn máy tính Corsair RM850e 850W chuẩn 80 Plus Gold Fully Modular mang đến năng lượng sạch, ổn định và hiệu suất cao cho hệ thống của bạn.",
                "specs": {"Công suất": "850W", "Chuẩn": "80 Plus Gold", "Loại cáp": "Fully Modular", "Kích thước quạt": "120mm"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344463/ez4ence/products/nguon-corsair-rm850e-850w-1.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344485/ez4ence/products/nguon-corsair-rm850e-850w-2.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344508/ez4ence/products/nguon-corsair-rm850e-850w-3.png"
                ]
            },
            {
                "name": "Tản nhiệt nước NZXT Kraken Elite 360",
                "slug": "tan-nhiet-nuoc-nzxt-kraken-elite-360",
                "price": 7590000,
                "promotional_price": 6990000,
                "stock": 8,
                "category_id": category_objects["Case"].id,
                "brand_id": brand_objects["nzxt"].id,
                "description": "Tản nhiệt nước AIO cao cấp NZXT Kraken Elite 360 với màn hình LCD 2.36 inch sắc nét hiển thị thông tin hệ thống hoặc ảnh GIF tùy chỉnh.",
                "specs": {"Loại tản": "Tản nhiệt nước AIO", "Kích thước Rad": "360mm", "Quạt": "3 x 120mm PWM", "Màn hình": "LCD 2.36 inch"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344529/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-1.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344550/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-2.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344571/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-3.jpg"
                ]
            },
            {
                "name": "Case NZXT H9 Flow",
                "slug": "case-nzxt-h9-flow",
                "price": 4290000,
                "promotional_price": 3990000,
                "stock": 12,
                "category_id": category_objects["Case"].id,
                "brand_id": brand_objects["nzxt"].id,
                "description": "Case NZXT H9 Flow có thiết kế buồng đôi rộng rãi, kính cường lực liền mạch cho cái nhìn toàn cảnh linh kiện bên trong, cùng luồng khí lưu thông ấn tượng.",
                "specs": {"Loại": "Mid Tower buồng đôi", "Kính": "Kính cường lực 2 mặt", "Hỗ trợ tản": "Lên đến 360mm ở nhiều vị trí"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344594/ez4ence/products/case-nzxt-h9-flow-1.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344617/ez4ence/products/case-nzxt-h9-flow-2.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344639/ez4ence/products/case-nzxt-h9-flow-3.png"
                ]
            },
            {
                "name": "Tai nghe Razer BlackShark V2",
                "slug": "tai-nghe-razer-blackshark-v2",
                "price": 2690000,
                "promotional_price": 2290000,
                "stock": 18,
                "category_id": category_objects["Tai nghe"].id,
                "brand_id": brand_objects["razer"].id,
                "description": "Razer BlackShark V2 trang bị màng loa Triforce Titanium 50mm, mang lại dải âm tách bạch. Thiết kế siêu nhẹ và cách âm thụ động cực tốt.",
                "specs": {"Kết nối": "Có dây + USB Sound Card", "Màng loa": "Triforce Titanium 50mm", "Mic": "HyperClear Cardioid", "Trọng lượng": "240g"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344660/ez4ence/products/tai-nghe-razer-blackshark-v2-1.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344682/ez4ence/products/tai-nghe-razer-blackshark-v2-2.png",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344705/ez4ence/products/tai-nghe-razer-blackshark-v2-3.png"
                ]
            },
            {
                "name": "Tai nghe SteelSeries Arctis Nova Pro",
                "slug": "tai-nghe-steelseries-arctis-nova-pro",
                "price": 6490000,
                "promotional_price": 5990000,
                "stock": 5,
                "category_id": category_objects["Tai nghe"].id,
                "brand_id": brand_objects["steelseries"].id,
                "description": "Tai nghe audiophile gaming SteelSeries Arctis Nova Pro mang đến trải nghiệm Almighty Audio nhờ bộ giải mã DAC chuyên dụng.",
                "specs": {"Kết nối": "Có dây + GameDAC Gen 2", "Độ phân giải": "Hi-Res Audio", "Khử ồn": "Chủ động (ANC)", "Tương thích": "PC, PS5, Switch"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344771/ez4ence/products/tai-nghe-steelseries-arctis-nova-pro-3.png"
                ]
            },
            {
                "name": "Tai nghe Corsair HS80 RGB Wireless",
                "slug": "tai-nghe-corsair-hs80-rgb-wireless",
                "price": 3890000,
                "promotional_price": 3490000,
                "stock": 12,
                "category_id": category_objects["Tai nghe"].id,
                "brand_id": brand_objects["corsair"].id,
                "description": "Kết nối không dây siêu tốc Slipstream, Corsair HS80 RGB Wireless hỗ trợ Dolby Atmos và mic thu âm chuẩn broadcast.",
                "specs": {"Kết nối": "Không dây 2.4GHz / USB", "Âm thanh": "Dolby Atmos", "Màng loa": "Neodymium 50mm", "Thời lượng pin": "Lên đến 20 giờ"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345105/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-1.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345107/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-2.jpg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345109/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-3.jpg"
                ]
            },
            {
                "name": "Tản nhiệt khí Deepcool AK620",
                "slug": "tan-nhiet-khi-deepcool-ak620",
                "price": 1490000,
                "promotional_price": 1290000,
                "stock": 20,
                "category_id": category_objects["Case"].id,
                "brand_id": brand_objects["deepcool"].id,
                "description": "Tản nhiệt khí Deepcool AK620 mang lại hiệu năng làm mát ngang ngửa nhiều tản nhiệt nước AIO, với thiết kế tháp đôi và 6 ống đồng dẫn nhiệt.",
                "specs": {"Loại tản": "Tháp đôi (Dual Tower)", "Quạt": "2 x 120mm PWM", "Số ống đồng": "6", "Hỗ trợ socket": "Intel 1700, AMD AM5"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345111/ez4ence/products/tan-nhiet-khi-deepcool-ak620-1.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345113/ez4ence/products/tan-nhiet-khi-deepcool-ak620-2.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345116/ez4ence/products/tan-nhiet-khi-deepcool-ak620-3.svg"
                ]
            },
            {
                "name": "Tai nghe Logitech G Pro X",
                "slug": "tai-nghe-logitech-g-pro-x",
                "price": 2890000,
                "promotional_price": 2490000,
                "stock": 25,
                "category_id": category_objects["Tai nghe"].id,
                "brand_id": brand_objects["logitech"].id,
                "description": "Tai nghe gaming cao cấp Logitech G Pro X với màng loa PRO-G 50mm, công nghệ Blue VO!CE mang đến chất lượng đàm thoại xuất sắc cho eSports.",
                "specs": {"Kết nối": "Có dây (USB/3.5mm)", "Màng loa": "PRO-G 50mm", "Công nghệ mic": "Blue VO!CE", "Trọng lượng": "320g"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345119/ez4ence/products/tai-nghe-logitech-g-pro-x-1.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345121/ez4ence/products/tai-nghe-logitech-g-pro-x-2.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345124/ez4ence/products/tai-nghe-logitech-g-pro-x-3.svg"
                ]
            },
            {
                "name": "Tai nghe HyperX Cloud III",
                "slug": "tai-nghe-hyperx-cloud-iii",
                "price": 2490000,
                "promotional_price": 2190000,
                "stock": 30,
                "category_id": category_objects["Tai nghe"].id,
                "brand_id": brand_objects["hyperx"].id,
                "description": "Huyền thoại trở lại với HyperX Cloud III, nâng cấp màng loa 53mm nghiêng và đệm tai memory foam mang đến sự thoải mái đặc trưng và âm thanh chân thực.",
                "specs": {"Kết nối": "Có dây (USB-C/USB-A/3.5mm)", "Màng loa": "53mm", "Đệm tai": "Memory foam cao cấp", "Âm thanh vòm": "DTS Headphone:X"},
                "images": [
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345129/ez4ence/products/tai-nghe-hyperx-cloud-iii-1.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345132/ez4ence/products/tai-nghe-hyperx-cloud-iii-2.svg",
                    "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781345134/ez4ence/products/tai-nghe-hyperx-cloud-iii-3.svg"
                ]
            },
        ]

        # Kiểm tra và thêm mới sản phẩm nếu chưa có
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
                    description=p_data["description"],
                    specifications=p_data["specs"],
                    is_published=True
                )
                db.add(p)
                
                sku = ProductSKU(
                    id=str(uuid.uuid4()),
                    product_id=p_id,
                    sku_code=f"SKU-{p_data['slug'].upper()}",
                    price=p_data["price"],
                    promotional_price=p_data["promotional_price"],
                    stock_quantity=p_data["stock"],
                    attributes={}
                )
                db.add(sku)
                
                for idx, img_url in enumerate(p_data["images"]):
                    img = ProductImage(
                        id=str(uuid.uuid4()),
                        product_id=p_id,
                        url=img_url,
                        is_primary=(idx == 0),
                        alt_text=f"{p_data['name']} image {idx+1}"
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
