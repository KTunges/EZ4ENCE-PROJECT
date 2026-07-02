from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
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
from pydantic import BaseModel
from typing import Optional, Dict, Any
from fastapi import UploadFile, File
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

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

    for add_url in (product_in.additional_images or []):
        if add_url:
            add_img = ProductImage(
                id=str(uuid.uuid4()),
                product_id=new_product.id,
                url=add_url,
                is_primary=False
            )
            db.add(add_img)

    db.commit()
    db.refresh(new_product)
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
        "image_url": next((img.url for img in product.images if img.is_primary), product.images[0].url if product.images else ""),
        "additional_images": [img.url for img in product.images if not img.is_primary]

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
        
    # Replace all images
    db.query(ProductImage).filter(ProductImage.product_id == product.id).delete()
    
    if product_in.image_url:
        img = ProductImage(
            id=str(uuid.uuid4()),
            product_id=product.id,
            url=product_in.image_url,
            is_primary=True
        )
        db.add(img)
        
    for add_url in (product_in.additional_images or []):
        if add_url:
            add_img = ProductImage(
                id=str(uuid.uuid4()),
                product_id=product.id,
                url=add_url,
                is_primary=False
            )
            db.add(add_img)

    db.commit()
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
        
    # Thay vì xoá cứng, ta có thể chỉ ẩn nó (is_published = False)
    # Tuy nhiên ở đây thực hiện xóa cứng để dễ quản lý
    db.delete(product)
    db.commit()
    return {"message": "Đã xóa sản phẩm"}
