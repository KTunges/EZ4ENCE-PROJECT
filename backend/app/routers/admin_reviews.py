from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import AdminReviewResponse, ReviewReplyRequest, ReviewToggleHiddenRequest
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/admin/reviews", tags=["Admin Reviews"])

@router.get("", response_model=List[AdminReviewResponse])
def get_reviews(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Lấy danh sách tất cả các đánh giá.
    Cần phải query kèm theo thông tin User và Product để hiển thị chi tiết.
    """
    reviews = db.query(Review).all()
    
    result = []
    for rv in reviews:
        rv_dict = {
            "id": rv.id,
            "user_id": rv.user_id,
            "sku_id": rv.sku_id,
            "rating": rv.rating,
            "comment": rv.comment,
            "admin_reply": rv.admin_reply,
            "is_hidden": rv.is_hidden,
            "created_at": rv.created_at,
            "images": rv.images,
            "user_name": rv.user.full_name if rv.user else "Khách hàng",
            "product_name": rv.sku.product.name if (rv.sku and rv.sku.product) else "Sản phẩm không rõ"
        }
        result.append(rv_dict)
        
    return result

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Xóa một đánh giá vi phạm.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    db.delete(review)
    db.commit()
    return None

@router.post("/{review_id}/reply")
def reply_review(review_id: str, request: ReviewReplyRequest, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Admin trả lời đánh giá của khách hàng.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review.admin_reply = request.reply
    db.commit()
    return {"message": "Đã lưu câu trả lời", "admin_reply": review.admin_reply}

@router.put("/{review_id}/hide")
def toggle_hide_review(review_id: str, request: ReviewToggleHiddenRequest, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """
    Ẩn hoặc hiện đánh giá.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review.is_hidden = request.is_hidden
    db.commit()
    status_str = "đã bị ẩn" if review.is_hidden else "đã được hiện"
    return {"message": f"Đánh giá {status_str}", "is_hidden": review.is_hidden}
