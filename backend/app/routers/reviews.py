import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List, Optional
from app.schemas.review import ReviewCreateRequest, CustomerReviewResponse, ReviewLikeToggleResponse
from app.models.order import Order, OrderItem, OrderStatus
from app.models.review import Review, ReviewImage, ReviewLike
from app.models.user import User
from app.models.product import ProductSKU
from app.routers.auth import get_current_user
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=CustomerReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    sku_id: str = Form(...),
    rating: int = Form(...),
    comment: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify SKU exists
    sku = db.query(ProductSKU).filter(ProductSKU.id == sku_id).first()
    if not sku:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
        
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Đánh giá phải từ 1 đến 5 sao")

    # Check purchase status
    has_purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.sku_id == sku_id,
        Order.status == OrderStatus.DELIVERED
    ).first()

    if not has_purchased:
        raise HTTPException(status_code=403, detail="Bạn chỉ có thể đánh giá sau khi đã mua và nhận hàng thành công.")

    # Create Review
    new_review = Review(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        sku_id=sku.id,
        rating=rating,
        comment=comment,
        is_hidden=False
    )
    db.add(new_review)
    
    # Upload images
    if images:
        for img in images:
            if img.filename: # check if file is not empty
                img_url = upload_image(img, "ez4gear/reviews")
                new_image = ReviewImage(
                    id=str(uuid.uuid4()),
                    review_id=new_review.id,
                    url=img_url
                )
                db.add(new_image)

    db.commit()
    db.refresh(new_review)

    # Convert to response
    response_data = CustomerReviewResponse.model_validate(new_review)
    response_data.helpful_count = 0
    response_data.is_liked_by_user = False
    return response_data

@router.post("/{review_id}/like", response_model=ReviewLikeToggleResponse)
def toggle_like_review(
    review_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Đánh giá không tồn tại")
        
    like = db.query(ReviewLike).filter(ReviewLike.review_id == review_id, ReviewLike.user_id == current_user.id).first()
    is_liked = False
    
    if like:
        db.delete(like)
    else:
        new_like = ReviewLike(id=str(uuid.uuid4()), review_id=review_id, user_id=current_user.id)
        db.add(new_like)
        is_liked = True
        
    db.commit()
    helpful_count = db.query(ReviewLike).filter(ReviewLike.review_id == review_id).count()
    
    return {"is_liked": is_liked, "helpful_count": helpful_count}
