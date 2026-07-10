"""
Open Graph endpoint — phục vụ Facebook/social media crawlers.

Khi share link sản phẩm trên Facebook, FB bot sẽ crawl URL để lấy
Open Graph meta tags (og:title, og:image, og:description...).
Vì frontend là SPA (React), bot không render được JS,
nên cần endpoint này trả HTML tĩnh chứa OG tags.

Flow:
  1. ShareButton gửi URL: https://{domain}/api/og/product/{slug}
  2. Facebook crawler crawl URL đó → đọc OG tags → hiện preview (ảnh, tên, giá)
  3. Khi user thật click link → redirect về trang SPA frontend
"""

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.product import Product, ProductSKU, ProductImage

router = APIRouter(tags=["OpenGraph"])


def format_price(price: float) -> str:
    """Format giá tiền theo chuẩn VNĐ"""
    if price is None:
        return ""
    return f"{price:,.0f}₫".replace(",", ".")


@router.get("/og/product/{slug}", response_class=HTMLResponse)
def og_product(slug: str, request: Request, db: Session = Depends(get_db)):
    """
    Trả về trang HTML nhẹ chứa Open Graph meta tags cho sản phẩm.
    Facebook crawler sẽ đọc meta tags này để tạo preview khi share.
    User thật sẽ được redirect về trang SPA.
    """
    product = db.query(Product).filter(
        Product.slug == slug,
        Product.is_published == True
    ).options(
        joinedload(Product.images),
        joinedload(Product.skus),
        joinedload(Product.brand),
        joinedload(Product.category),
    ).first()

    if not product:
        return HTMLResponse("<html><body>Product not found</body></html>", status_code=404)

    # Lấy ảnh chính
    primary_image = ""
    if product.images:
        primary = next((img for img in product.images if img.is_primary), None)
        if primary:
            primary_image = primary.url
        elif product.images:
            primary_image = product.images[0].url

    # Lấy giá từ SKU đầu tiên
    price_text = ""
    price_amount = ""
    currency = "VND"
    if product.skus:
        sku = product.skus[0]
        price_amount = str(sku.price)
        if sku.promotional_price and sku.promotional_price < sku.price:
            price_text = f"🔥 {format_price(sku.promotional_price)} (giảm từ {format_price(sku.price)})"
        else:
            price_text = format_price(sku.price)

    # Tạo description với giá tiền
    raw_desc = (product.description or "").replace('"', '&quot;').replace("<", "&lt;")[:200]
    description = f"{raw_desc} | Giá: {price_text}" if price_text else raw_desc

    # Escape HTML entities cho tên sản phẩm
    product_name = (product.name or "").replace('"', '&quot;').replace("<", "&lt;")
    brand_name = ""
    if product.brand:
        brand_name = (product.brand.name or "").replace('"', '&quot;')

    # URL frontend thật (để redirect user)
    # Dùng Referer header hoặc cấu hình mặc định
    base_url = str(request.base_url).rstrip("/")
    frontend_url = f"/product/{slug}"

    # Site name
    site_name = "EZ4GEAR - Gaming &amp; Tech Store"

    html = f"""<!DOCTYPE html>
<html lang="vi" prefix="og: http://ogp.me/ns# product: http://ogp.me/ns/product#">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{product_name} | {site_name}</title>

    <!-- Open Graph Meta Tags (Facebook) -->
    <meta property="og:type" content="og:product" />
    <meta property="og:title" content="{product_name}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{primary_image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="{str(request.url)}" />
    <meta property="og:site_name" content="{site_name}" />
    <meta property="og:locale" content="vi_VN" />

    <!-- Product specific OG tags -->
    <meta property="product:price:amount" content="{price_amount}" />
    <meta property="product:price:currency" content="{currency}" />
    {"<meta property='product:brand' content='" + brand_name + "' />" if brand_name else ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{product_name}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{primary_image}" />

    <!-- Redirect người dùng thật về trang SPA -->
    <script>
        // Bot Facebook có User-Agent chứa 'facebookexternalhit' hoặc 'Facebot'
        // Chỉ redirect nếu KHÔNG phải bot
        var ua = navigator.userAgent || '';
        if (!/facebookexternalhit|Facebot/i.test(ua)) {{
            window.location.replace('{frontend_url}');
        }}
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url={frontend_url}" />
    </noscript>
</head>
<body>
    <h1>{product_name}</h1>
    <p>{description}</p>
    {"<img src='" + primary_image + "' alt='" + product_name + "' style='max-width:600px' />" if primary_image else ""}
    <p><strong>Giá: {price_text}</strong></p>
    <p><a href="{frontend_url}">Xem sản phẩm tại {site_name}</a></p>
</body>
</html>"""

    return HTMLResponse(content=html)
