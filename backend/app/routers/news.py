from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.news import News
from app.schemas.news import NewsResponse
from datetime import datetime, timezone

router = APIRouter(tags=["News"])

@router.get("/news", response_model=List[NewsResponse])
def get_news_list(limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    """
    Lấy danh sách tin tức công nghệ
    """
    now = datetime.now(timezone.utc)
    query = db.query(News).filter(News.is_active == True)
    
    # Chỉ lấy bài đã xuất bản
    query = query.filter(
        (News.published_at == None) | (News.published_at <= now)
    )
    
    return query.order_by(News.created_at.desc()).limit(limit).all()

@router.get("/news/{slug}", response_model=NewsResponse)
def get_news_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Lấy chi tiết tin tức theo slug
    """
    news = db.query(News).filter(News.slug == slug, News.is_active == True).first()
    if not news:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Bài viết không tồn tại.")
    return news
