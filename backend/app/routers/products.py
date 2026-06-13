from fastapi import APIRouter, Depends, HTTPException, Query, Request, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.product import Product, ProductSKU, ProductImage
from app.models.category import Category
from app.models.brand import Brand
from app.schemas.product import ProductListResponse, ProductDetailResponse
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

@router.get("/products", response_model=List[ProductDetailResponse])
def get_products(
    request: Request,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_slug: Optional[str] = None,
    brand_slug: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Lấy danh sách sản phẩm. Có thể phân trang, lọc theo category, brand, tìm kiếm, 
    và các thông số kỹ thuật động (specifications).
    """
    query = db.query(Product).filter(Product.is_published == True)
    
    # Filter by category
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
        
    # Filter by brand
    if brand_slug:
        query = query.join(Brand).filter(Brand.slug == brand_slug)
        
    # Search by name
    if search:
        keywords = search.strip().split()
        for kw in keywords:
            query = query.filter(Product.name.ilike(f"%{kw}%"))
        
    # Lọc động dựa trên specifications (tất cả query params ngoài các tham số chuẩn)
    standard_params = {"skip", "limit", "category_slug", "brand_slug", "search"}
    for key, value in request.query_params.items():
        if key not in standard_params and value:
            # Lọc linh hoạt: cắt từng từ để tìm gần đúng trong JSON
            spec_keywords = value.strip().split()
            for skw in spec_keywords:
                query = query.filter(Product.specifications[key].astext.ilike(f"%{skw}%"))

    # Tối ưu truy vấn: load sẵn brand, category và images chính
    query = query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images),
        joinedload(Product.skus).joinedload(ProductSKU.reviews)
    )
    
    products = query.offset(skip).limit(limit).all()
    return products


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
        joinedload(Product.skus).joinedload(ProductSKU.reviews)
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product
