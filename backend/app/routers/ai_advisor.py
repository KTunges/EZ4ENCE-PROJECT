from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.product import Product, ProductSKU
from app.models.category import Category
from app.services.ai_service import GroqChatService
from loguru import logger
import json

router = APIRouter(prefix="/ai", tags=["AI Advisor"])

class BuildAdvisorRequest(BaseModel):
    budget: int           # ngân sách (VNĐ)
    purpose: str          # "Gaming", "Đồ hoạ", "Văn phòng", "Streaming"
    game_type: str = ""   # "FPS", "MOBA", "AAA", "Esports"

# Category keywords mapping
SLOT_KEYWORDS = {
    "CPU":       ["cpu", "core", "ryzen"],
    "Mainboard": ["mainboard", "z790", "b760", "b660", "x670", "b650"],
    "RAM":       ["ram", "ddr4", "ddr5"],
    "VGA":       ["rtx", "gtx", "radeon", "rx 7", "rx 6", "vga"],
    "SSD":       ["ssd", "nvme", "hdd"],
    "Nguồn":     ["nguồn", "psu", "power"],
    "Case":      ["case", "vỏ máy"],
    "Tản nhiệt": ["tản nhiệt", "cooler", "kraken"],
}

def get_products_for_slot(db: Session, slot: str, budget_per_slot: int):
    """Lấy top 6 sản phẩm phù hợp với slot và ngân sách."""
    keywords = SLOT_KEYWORDS.get(slot, [])
    if not keywords:
        return []

    # Query sản phẩm có SKU và còn hàng
    query = db.query(Product).join(ProductSKU, Product.id == ProductSKU.product_id)

    # Lọc theo tên (keyword)
    from sqlalchemy import or_
    keyword_filters = [func.lower(Product.name).contains(kw.lower()) for kw in keywords]
    query = query.filter(or_(*keyword_filters))

    # Lọc theo giá (không vượt 60% ngân sách mỗi slot để có room cho linh kiện khác)
    max_price = budget_per_slot * 1.5
    query = query.filter(ProductSKU.price <= max_price, ProductSKU.stock_quantity > 0)

    # Sắp xếp theo giá tốt nhất (gần ngân sách nhất)
    products = query.order_by(ProductSKU.price.desc()).limit(8).all()

    result = []
    for p in products:
        sku = db.query(ProductSKU).filter(
            ProductSKU.product_id == p.id,
            ProductSKU.stock_quantity > 0
        ).order_by(ProductSKU.price.desc()).first()
        if sku:
            result.append({
                "name": p.name,
                "price": sku.price,
                "sku_id": sku.id
            })
    return result

@router.post("/build-advisor")
async def build_advisor(req: BuildAdvisorRequest, db: Session = Depends(get_db)):
    """AI gợi ý cấu hình PC từ sản phẩm thật trong kho."""

    # Phân bổ ngân sách theo tỷ lệ chuẩn cho từng slot
    budget_ratios = {
        "CPU":       0.18,
        "Mainboard": 0.12,
        "RAM":       0.08,
        "VGA":       0.32,
        "SSD":       0.07,
        "Nguồn":     0.08,
        "Case":      0.07,
        "Tản nhiệt": 0.08,
    }

    # Điều chỉnh tỷ lệ theo mục đích
    if req.purpose == "Đồ hoạ":
        budget_ratios["VGA"] = 0.40
        budget_ratios["RAM"] = 0.12
        budget_ratios["CPU"] = 0.16
    elif req.purpose == "Văn phòng":
        budget_ratios["VGA"] = 0.10
        budget_ratios["CPU"] = 0.22
        budget_ratios["RAM"] = 0.12

    # Lấy sản phẩm thật từ DB cho từng slot
    available_products = {}
    for slot, ratio in budget_ratios.items():
        budget_for_slot = int(req.budget * ratio)
        products = get_products_for_slot(db, slot, budget_for_slot)
        available_products[slot] = products[:5]  # Top 5 mỗi slot

    # Tạo prompt cho AI
    products_context = ""
    for slot, products in available_products.items():
        if products:
            products_context += f"\n**{slot}** (ngân sách ~{int(req.budget * budget_ratios[slot]):,}đ):\n"
            for p in products:
                products_context += f"  - {p['name']}: {p['price']:,}đ\n"
        else:
            products_context += f"\n**{slot}**: Không có sản phẩm phù hợp trong kho\n"

    prompt = f"""Bạn là chuyên gia tư vấn cấu hình PC tại cửa hàng EZ4GEAR.

Khách hàng cần build PC với:
- Ngân sách: {req.budget:,}đ
- Mục đích: {req.purpose}
- Thể loại game (nếu có): {req.game_type or "Không có"}

Danh sách sản phẩm HIỆN CÓ trong kho:
{products_context}

Hãy chọn 1 sản phẩm tốt nhất cho mỗi slot từ danh sách trên, đảm bảo:
1. Tổng giá KHÔNG vượt ngân sách {req.budget:,}đ
2. Linh kiện phải có trong danh sách sản phẩm kho ở trên
3. Tối ưu cho mục đích {req.purpose}

Trả về JSON (không giải thích thêm), format:
{{
  "CPU": "tên sản phẩm chính xác từ danh sách",
  "Mainboard": "tên sản phẩm chính xác từ danh sách",
  "RAM": "tên sản phẩm chính xác từ danh sách",
  "VGA": "tên sản phẩm chính xác từ danh sách",
  "SSD": "tên sản phẩm chính xác từ danh sách",
  "Nguồn": "tên sản phẩm chính xác từ danh sách",
  "Case": "tên sản phẩm chính xác từ danh sách",
  "Tản nhiệt": "tên sản phẩm chính xác từ danh sách",
  "total_price": 0,
  "ai_note": "Nhận xét ngắn về build này (1-2 câu tiếng Việt)"
}}

Nếu slot nào không có sản phẩm trong kho, dùng null cho giá trị đó."""

    groq_service = GroqChatService()
    try:
        raw_response = await groq_service.get_ai_response([], prompt)

        # Parse JSON từ response
        # Tìm JSON block trong response
        start = raw_response.find('{')
        end = raw_response.rfind('}') + 1
        if start == -1 or end == 0:
            raise ValueError("AI không trả về JSON hợp lệ")

        suggestion = json.loads(raw_response[start:end])

        # Đính kèm thông tin đầy đủ (price, sku_id) từ DB vào gợi ý
        enriched = {}
        for slot, product_name in suggestion.items():
            if slot in ("total_price", "ai_note") or not product_name:
                enriched[slot] = product_name
                continue

            # Tìm sản phẩm trong available_products theo tên
            matched = next(
                (p for p in available_products.get(slot, [])
                 if product_name.lower() in p["name"].lower() or p["name"].lower() in product_name.lower()),
                None
            )
            if matched:
                enriched[slot] = matched  # {"name", "price", "sku_id"}
            else:
                enriched[slot] = {"name": product_name, "price": 0, "sku_id": None}

        enriched["ai_note"] = suggestion.get("ai_note", "")
        return enriched

    except Exception as e:
        logger.error(f"AI Build Advisor error: {e}")
        return {"error": "AI không thể tạo gợi ý lúc này. Vui lòng thử lại!"}
