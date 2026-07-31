from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.news import News
from app.schemas.news import NewsResponse, NewsCreate, NewsUpdate
from app.routers.auth import get_current_admin, get_current_marketing

router = APIRouter(
    prefix="/admin/news",
    tags=["Admin News"],
    dependencies=[Depends(get_current_marketing)]
)

@router.get("", response_model=List[NewsResponse])
def get_all_news(db: Session = Depends(get_db)):
    news_list = db.query(News).order_by(News.created_at.desc()).all()
    return news_list

@router.post("", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(news_in: NewsCreate, db: Session = Depends(get_db)):
    existing = db.query(News).filter(News.slug == news_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug bài viết đã tồn tại.")

    new_news = News(
        id=str(uuid.uuid4()),
        **news_in.model_dump()
    )
    db.add(new_news)
    db.commit()
    db.refresh(new_news)
    return new_news

@router.put("/{news_id}", response_model=NewsResponse)
def update_news(news_id: str, news_in: NewsUpdate, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Bài viết không tồn tại.")

    if news_in.slug and news_in.slug != news.slug:
        existing = db.query(News).filter(News.slug == news_in.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug bài viết đã tồn tại.")

    update_data = news_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(news, key, value)

    db.commit()
    db.refresh(news)
    return news

@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: str, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Bài viết không tồn tại.")
    db.delete(news)
    db.commit()
    return None
