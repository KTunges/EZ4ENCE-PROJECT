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

class ProductSKUResponse(ProductSKUBase):
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
    id: str
    created_at: datetime
    # Computed fields
    rating: float
    review_count: int
    sold_count: int
    # Trả về kèm một ảnh đại diện (ảnh chính) và giá min/max của các SKU nếu cần ở list
    images: List[ProductImageResponse] = []
    category: Optional[CategoryResponse] = None
    brand: Optional[BrandResponse] = None
    skus: List[ProductSKUResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProductDetailResponse(ProductListResponse):
    # Chi tiết sẽ bao gồm danh sách biến thể SKU
    skus: List[ProductSKUResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProductPaginatedResponse(BaseModel):
    data: List[ProductListResponse]
    total: int
    page: int
    page_size: int
