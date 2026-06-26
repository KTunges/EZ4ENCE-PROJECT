import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.review import Review
from app.models.product import ProductSKU
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.review import ReviewCreateRequest, CustomerReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=CustomerReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    req: ReviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify SKU exists
    sku = db.query(ProductSKU).filter(ProductSKU.id == req.sku_id).first()
    if not sku:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        
    if req.rating < 1 or req.rating > 5:
        raise HTTPException(status_code=400, detail="Đánh giá phải từ 1 đến 5 sao")

    # Create Review
    new_review = Review(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        sku_id=sku.id,
        rating=req.rating,
        comment=req.comment,
        is_hidden=False
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review
