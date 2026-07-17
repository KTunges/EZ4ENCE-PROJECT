from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List
import uuid
import random
import re
import unicodedata

from app.database import get_db
from app.models.product import Product, ProductSKU, ProductImage
from app.models.category import Category
from app.models.brand import Brand
from app.models.user import User, Role
from app.routers.auth import get_current_user, get_current_admin
from app.routers.products import invalidate_public_products_cache
from pydantic import BaseModel
from typing import Optional, Dict, Any
from fastapi import UploadFile, File
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

# Simple in-memory cache for product list
import time as _time
_products_cache: dict = {"data": None, "timestamp": 0}
_CACHE_TTL = 30  # seconds


def _invalidate_products_cache():
    """Call this after create/update/delete product to bust cache."""
    _products_cache["data"] = None
    _products_cache["timestamp"] = 0


@router.get("/list")
def get_admin_products_list(
    search: Optional[str] = None,
    nocache: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    API siêu nhẹ cho bảng danh sách sản phẩm admin.
    Có cache 30s để tránh round-trip đến Supabase mỗi lần load.
    """
    now = _time.time()

    # Return cache if fresh and no search filter
    if (not search and not nocache
            and _products_cache["data"] is not None
            and now - _products_cache["timestamp"] < _CACHE_TTL):
        return _products_cache["data"]

    # Subquery lấy giá và tồn kho từ SKU
    sku_sub = db.query(
        ProductSKU.product_id,
        func.min(ProductSKU.price).label('price'),
        func.min(ProductSKU.promotional_price).label('sale_price'),
        func.sum(ProductSKU.stock_quantity).label('stock')
    ).group_by(ProductSKU.product_id).subquery()

    # Subquery lấy 1 ảnh đại diện
    img_sub = db.query(
        ProductImage.product_id,
        func.min(
            case(
                (ProductImage.is_primary == True, ProductImage.url),
                else_=ProductImage.url
            )
        ).label('image_url')
    ).group_by(ProductImage.product_id).subquery()

    query = db.query(
        Product.id,
        Product.name,
        Product.slug,
        Product.is_published,
        Product.sold_count,
        Category.name.label('category_name'),
        Category.id.label('category_id'),
        Brand.name.label('brand_name'),
        sku_sub.c.price,
        sku_sub.c.sale_price,
        sku_sub.c.stock,
        img_sub.c.image_url
    ).outerjoin(Category, Product.category_id == Category.id
    ).outerjoin(Brand, Product.brand_id == Brand.id
    ).outerjoin(sku_sub, Product.id == sku_sub.c.product_id
    ).outerjoin(img_sub, Product.id == img_sub.c.product_id)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    rows = query.order_by(Product.created_at.desc()).all()

    result = [
        {
            "id": r.id,
            "name": r.name,
            "slug": r.slug,
            "is_published": r.is_published,
            "sold_count": r.sold_count or 0,
            "category": {"id": r.category_id, "name": r.category_name} if r.category_name else None,
            "brand": {"name": r.brand_name} if r.brand_name else None,
            "skus": [{"sku": "", "price": float(r.price or 0), "promotional_price": float(r.sale_price) if r.sale_price else None, "stock_quantity": int(r.stock or 0)}],
            "images": [{"url": r.image_url}] if r.image_url else [],
            "image_url": r.image_url or ""
        }
        for r in rows
    ]

    # Cache result (only for non-search queries)
    if not search:
        _products_cache["data"] = result
        _products_cache["timestamp"] = now

    return result


@router.get("/search-skus")
def search_products_with_skus(
    search: str = "",
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Tìm sản phẩm kèm danh sách SKU đầy đủ (id, sku_code, price, stock).
    Dùng cho Flash Sale picker.
    """
    from sqlalchemy.orm import joinedload
    
    query = db.query(Product).options(
        joinedload(Product.skus),
        joinedload(Product.images)
    )
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    products = query.order_by(Product.created_at.desc()).limit(30).all()
    
    result = []
    for p in products:
        skus_data = []
        for sku in p.skus:
            skus_data.append({
                "id": sku.id,
                "sku_code": sku.sku_code,
                "price": float(sku.price),
                "promotional_price": float(sku.promotional_price) if sku.promotional_price else None,
                "stock_quantity": sku.stock_quantity
            })
        
        result.append({
            "id": p.id,
            "name": p.name,
            "image_url": p.images[0].url if p.images else "",
            "skus": skus_data
        })
    
    return result


class ProductCreateUpdate(BaseModel):
    name: str
    category: str # Accepts name like 'CPU'
    brand: Optional[str] = None # Accepts name like 'ASUS'
    description: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    is_published: bool = True
    
    # Extended fields for simplified form
    price: float
    sale_price: Optional[float] = None
    stock: int = 0
    image_url: Optional[str] = None
    additional_images: Optional[List[str]] = []
    
    from pydantic import field_validator

    @field_validator('stock')
    @classmethod
    def stock_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError('Số lượng tồn kho không được âm')
        return v
    
    @field_validator('price')
    @classmethod
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Giá bán phải lớn hơn 0')
        return v
    
    @field_validator('sale_price')
    @classmethod
    def sale_price_must_be_non_negative(cls, v):
        if v is not None and v < 0:
            raise ValueError('Giá khuyến mãi không được âm')
        return v

@router.post("/upload-image")
def upload_admin_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    try:
        url = upload_image(file)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreateUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Tạo slug tự động từ tên (giản lược)
    def slugify(text: str) -> str:
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
        text = re.sub(r'[^\w\s-]', '', text).strip().lower()
        return re.sub(r'[-\s]+', '-', text)
        
    slug = slugify(product_in.name)
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        slug = f"{slug}-{str(uuid.uuid4())[:8]}"

    # Find or create Category — tìm bằng NAME trước (vì form gửi tên), rồi mới tìm bằng slug
    category_id = None
    if product_in.category:
        cat = db.query(Category).filter(Category.name == product_in.category).first()
        if not cat:
            cat_slug = slugify(product_in.category)
            cat = db.query(Category).filter(Category.slug == cat_slug).first()
        if not cat:
            cat_slug = slugify(product_in.category)
            cat = Category(id=str(uuid.uuid4()), name=product_in.category, slug=cat_slug)
            db.add(cat)
            db.flush()
        category_id = cat.id

    # Find or create Brand
    brand_id = None
    if product_in.brand:
        brand_slug = slugify(product_in.brand)
        brand = db.query(Brand).filter(Brand.slug == brand_slug).first()
        if not brand:
            brand = Brand(id=str(uuid.uuid4()), name=product_in.brand, slug=brand_slug)
            db.add(brand)
            db.flush()
        brand_id = brand.id

    new_product = Product(
        id=str(uuid.uuid4()),
        name=product_in.name,
        slug=slug,
        description=product_in.description,
        specifications=product_in.specifications or {},
        category_id=category_id,
        brand_id=brand_id,
        is_published=product_in.is_published
    )
    db.add(new_product)
    
    # Create Default SKU
    sku = ProductSKU(
        id=str(uuid.uuid4()),
        product_id=new_product.id,
        sku_code=f"SKU-{slug.upper()[:10]}-{random.randint(100,999)}",
        price=product_in.price,
        promotional_price=product_in.sale_price,
        stock_quantity=product_in.stock,
        attributes={}
    )
    db.add(sku)
    
    # Create Image if provided
    if product_in.image_url:
        img = ProductImage(
            id=str(uuid.uuid4()),
            product_id=new_product.id,
            url=product_in.image_url,
            is_primary=True
        )
        db.add(img)

    db.commit()
    db.refresh(new_product)
    _invalidate_products_cache()
    invalidate_public_products_cache()
    return {"message": "Sản phẩm được tạo thành công", "product_id": new_product.id}

@router.get("/{product_id}")
def get_product_detail(
    product_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category.name if product.category else "",
        "brand": product.brand.name if product.brand else "",
        "description": product.description,
        "specifications": product.specifications,
        "is_published": product.is_published,
        "price": product.skus[0].price if product.skus else 0,
        "sale_price": product.skus[0].promotional_price if product.skus else None,
        "stock": sum([sku.stock_quantity for sku in product.skus]) if product.skus else 0,
        "image_url": next((img.url for img in product.images if img.is_primary), product.images[0].url if product.images else "")
    }

@router.put("/{product_id}", response_model=dict)
def update_product(
    product_id: str,
    product_in: ProductCreateUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        
    product.name = product_in.name
    product.description = product_in.description
    product.specifications = product_in.specifications or {}
    product.is_published = product_in.is_published

    # Update Category
    if product_in.category:
        def slugify(text: str) -> str:
            text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
            text = re.sub(r'[^\w\s-]', '', text).strip().lower()
            return re.sub(r'[-\s]+', '-', text)

        cat = db.query(Category).filter(Category.name == product_in.category).first()
        if not cat:
            cat_slug = slugify(product_in.category)
            cat = db.query(Category).filter(Category.slug == cat_slug).first()
        if cat:
            product.category_id = cat.id

    # Update Brand
    if product_in.brand:
        brand = db.query(Brand).filter(Brand.name == product_in.brand).first()
        if brand:
            product.brand_id = brand.id
    
    if product.skus:
        product.skus[0].price = product_in.price
        product.skus[0].promotional_price = product_in.sale_price
        product.skus[0].stock_quantity = product_in.stock
        
    if product_in.image_url:
        if product.images:
            product.images[0].url = product_in.image_url
        else:
            img = ProductImage(
                id=str(uuid.uuid4()),
                product_id=product.id,
                url=product_in.image_url,
                is_primary=True
            )
            db.add(img)
    
    db.commit()
    _invalidate_products_cache()
    invalidate_public_products_cache()
    return {"message": "Cập nhật sản phẩm thành công", "product_id": product.id}

@router.delete("/{product_id}", response_model=dict)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        
    db.delete(product)
    db.commit()
    _invalidate_products_cache()
    invalidate_public_products_cache()
    return {"message": "Đã xóa sản phẩm"}
