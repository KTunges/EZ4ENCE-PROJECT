from fastapi import APIRouter, Depends, HTTPException, Query, Request, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid
from sqlalchemy import or_, func, cast, String, desc

from app.database import get_db
from app.models.product import Product, ProductSKU, ProductImage
from app.models.review import Review
from app.models.category import Category
from app.models.brand import Brand
from app.schemas.product import ProductListResponse, ProductDetailResponse, ProductPaginatedResponse
from app.services.cloudinary_service import upload_image

router = APIRouter(tags=["Products"])

@router.post("/products/{product_id}/upload-image")
def upload_product_image(product_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Tải ảnh lên Cloudinary và lưu URL vào database cho sản phẩm cụ thể.
    """
    # 1. Kiểm tra sản phẩm có tồn tại không
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # 2. Upload lên Cloudinary
    image_url = upload_image(file)
    
    # 3. Lưu vào DB
    new_image = ProductImage(
        id=str(uuid.uuid4()),
        product_id=product.id,
        url=image_url,
        is_primary=False # Default is False, user can change later
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    
    return {"message": "Image uploaded successfully", "url": image_url, "image_id": new_image.id}

@router.get("/products", response_model=ProductPaginatedResponse)
def get_products(
    request: Request,
    skip: int = 0,
    limit: int = 12,
    page: int = 1,
    category_slug: Optional[str] = None,
    brand_slug: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách sản phẩm. Có thể phân trang, lọc theo category, brand, tìm kiếm, 
    và các thông số kỹ thuật động (specifications).
    """
    query = db.query(Product).filter(Product.is_published == True)
    
    # Cần join trước nếu có filter theo tag
    if category_slug or brand_slug:
        query = query.outerjoin(Category).outerjoin(Brand)

    # Filter by category exactly by slug (supports comma-separated multiple slugs)
    if category_slug:
        slugs = [s.strip().lower() for s in category_slug.split(',')]
        if len(slugs) == 1:
            query = query.filter(func.lower(Category.slug) == slugs[0])
        else:
            query = query.filter(func.lower(Category.slug).in_(slugs))
        
    # Filter by brand exactly by slug or name
    if brand_slug:
        query = query.filter(
            or_(
                func.lower(Brand.slug) == brand_slug.lower(),
                func.lower(Brand.name) == brand_slug.replace('-', ' ').lower()
            )
        )
        
    # Search by name
    if search:
        keywords = search.strip().split()
        for kw in keywords:
            query = query.filter(Product.name.ilike(f"%{kw}%"))
        
    # Price filtering
    if min_price is not None:
        query = query.join(Product.skus).filter(ProductSKU.price >= min_price)
    if max_price is not None:
        if min_price is None:
            query = query.join(Product.skus)
        query = query.filter(ProductSKU.price <= max_price)

    # Lọc động dựa trên specifications
    standard_params = {"skip", "limit", "page", "category_slug", "brand_slug", "search", "min_price", "max_price", "sort"}
    for key, value in request.query_params.items():
        if key not in standard_params and value:
            spec_keywords = value.strip().split()
            for skw in spec_keywords:
                query = query.filter(cast(Product.specifications[key], String).ilike(f"%{skw}%"))

    # Tối ưu truy vấn
    query = query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.skus).joinedload(ProductSKU.reviews)
    )
    
    # Sorting
    if sort:
        if sort == "newest":
            query = query.order_by(desc(Product.created_at))
        elif sort == "price-asc":
            if min_price is None and max_price is None:
                query = query.join(Product.skus)
            query = query.order_by(ProductSKU.price.asc())
        elif sort == "price-desc":
            if min_price is None and max_price is None:
                query = query.join(Product.skus)
            query = query.order_by(ProductSKU.price.desc())

    total = query.count()
    
    # Calculate skip from page
    skip_calc = skip if skip > 0 else (page - 1) * limit if page > 0 else 0
    products = query.offset(skip_calc).limit(limit).all()
    
    return {
        "data": products,
        "total": total,
        "page": page,
        "page_size": limit
    }


@router.get("/products/{slug}", response_model=ProductDetailResponse)
def get_product_detail(slug: str, db: Session = Depends(get_db)):
    """
    Lấy chi tiết 1 sản phẩm theo URL slug. Bao gồm các thông số JSONB và toàn bộ các biến thể SKUs.
    """
    product = db.query(Product).filter(
        Product.slug == slug,
        Product.is_published == True
    ).options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.skus).joinedload(ProductSKU.images),
        joinedload(Product.skus).joinedload(ProductSKU.reviews).joinedload(Review.user)
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product
