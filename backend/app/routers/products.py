from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.brand import Brand
from app.schemas.product import ProductListResponse, ProductDetailResponse

router = APIRouter(tags=["Products"])

@router.get("/products", response_model=List[ProductListResponse])
def get_products(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_slug: Optional[str] = None,
    brand_slug: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Lấy danh sách sản phẩm. Có thể phân trang, lọc theo category, brand, và tìm kiếm.
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
        query = query.filter(Product.name.ilike(f"%{search}%"))
        
    # Tối ưu truy vấn: load sẵn brand, category và images chính
    query = query.options(
        joinedload(Product.category),
        joinedload(Product.brand),
        joinedload(Product.images)
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
        joinedload(Product.skus).joinedload("images") # Load cả ảnh của SKU
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product
