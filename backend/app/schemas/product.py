from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime
from .category import CategoryResponse
from .brand import BrandResponse
from .review import CustomerReviewResponse

# --- Images ---
class ImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    is_primary: bool = False

class ProductImageResponse(ImageBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class SkuImageResponse(ImageBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

# --- SKUs (Variants) ---
class ProductSKUBase(BaseModel):
    sku_code: str
    price: float
    promotional_price: Optional[float] = None
    stock_quantity: int = 0
    attributes: Dict[str, Any] = {}

class ProductSKUListResponse(ProductSKUBase):
    """SKU nhẹ cho trang danh sách — KHÔNG kèm reviews/images"""
    id: str
    
    model_config = ConfigDict(from_attributes=True)

class ProductSKUResponse(ProductSKUBase):
    """SKU đầy đủ cho trang chi tiết — có reviews + images"""
    id: str
    images: List[SkuImageResponse] = []
    reviews: List[CustomerReviewResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

# --- Product (Master) ---
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    brand_id: Optional[str] = None
    specifications: Dict[str, Any] = {}
    is_published: bool = True

class ProductListResponse(ProductBase):
    """Schema nhẹ cho trang danh sách — SKU không kèm reviews"""
    id: str
    created_at: datetime
    # Computed fields
    rating: float
    review_count: int
    sold_count: int
    # Trả về kèm ảnh đại diện và SKU nhẹ (không reviews)
    images: List[ProductImageResponse] = []
    category: Optional[CategoryResponse] = None
    brand: Optional[BrandResponse] = None
    skus: List[ProductSKUListResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProductDetailResponse(ProductBase):
    """Schema đầy đủ cho trang chi tiết — SKU kèm reviews + images"""
    id: str
    created_at: datetime
    rating: float
    review_count: int
    sold_count: int
    images: List[ProductImageResponse] = []
    category: Optional[CategoryResponse] = None
    brand: Optional[BrandResponse] = None
    skus: List[ProductSKUResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProductPaginatedResponse(BaseModel):
    data: List[ProductListResponse]
    total: int
    page: int
    page_size: int
