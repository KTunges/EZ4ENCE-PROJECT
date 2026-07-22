from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.routers.auth import get_current_admin
from app.schemas.review import AdminReviewResponse, ReviewReplyRequest, ReviewToggleHiddenRequest

router = APIRouter(prefix="/admin/reviews", tags=["Admin Reviews"])

from sqlalchemy.orm import joinedload
from app.models.product import ProductSKU

@router.get("", response_model=List[AdminReviewResponse])
def get_all_reviews(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    reviews = db.query(Review).options(
        joinedload(Review.user),
        joinedload(Review.sku).joinedload(ProductSKU.product)
    ).order_by(Review.created_at.desc()).all()
    
    # Enrich with additional data
    result = []
    for r in reviews:
        resp = AdminReviewResponse.model_validate(r)
        resp.user_name = r.user.full_name if r.user else "Unknown"
        resp.product_name = r.sku.product.name if r.sku and r.sku.product else "Unknown"
        result.append(resp)
        
    return result

@router.put("/{review_id}/reply", response_model=AdminReviewResponse)
def reply_review(
    review_id: str,
    req: ReviewReplyRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Đánh giá không tồn tại")
        
    review.admin_reply = req.reply
    db.commit()
    db.refresh(review)
    
    resp = AdminReviewResponse.model_validate(review)
    resp.user_name = review.user.full_name if review.user else "Unknown"
    resp.product_name = review.sku.product.name if review.sku and review.sku.product else "Unknown"
    
    return resp

@router.put("/{review_id}/hide", response_model=AdminReviewResponse)
def toggle_hide_review(
    review_id: str,
    req: ReviewToggleHiddenRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Đánh giá không tồn tại")
        
    review.is_hidden = req.is_hidden
    db.commit()
    db.refresh(review)
    
    resp = AdminReviewResponse.model_validate(review)
    resp.user_name = review.user.full_name if review.user else "Unknown"
    resp.product_name = review.sku.product.name if review.sku and review.sku.product else "Unknown"
    
    return resp
