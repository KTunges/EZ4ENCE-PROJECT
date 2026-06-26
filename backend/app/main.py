import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.config import settings
from app.routers import (
    auth, categories, brands, products,
    carts, wishlist, shipping, orders, payment, chat, reviews,
    admin_dashboard, admin_categories, admin_brands, admin_products,
    admin_users, admin_orders, admin_reviews, admin_marketing, admin_news,
    admin_inventory, admin_staffs, admin_mailchimp, addresses, marketing, news
)

logger.add("../database/app.log", rotation="10 MB", level="INFO")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(brands.router, prefix="/api")
app.include_router(marketing.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(carts.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(addresses.router, prefix="/api")
app.include_router(shipping.router, prefix="/api")
app.include_router(admin_products.router, prefix="/api")
app.include_router(admin_orders.router, prefix="/api")
app.include_router(admin_categories.router, prefix="/api")
app.include_router(admin_brands.router, prefix="/api")
app.include_router(admin_users.router, prefix="/api")
app.include_router(admin_reviews.router, prefix="/api")
app.include_router(admin_marketing.router, prefix="/api")
app.include_router(admin_inventory.router, prefix="/api")
app.include_router(admin_dashboard.router, prefix="/api")
app.include_router(admin_staffs.router, prefix="/api")
app.include_router(admin_news.router, prefix="/api")
app.include_router(admin_mailchimp.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")

@app.get("/")
def read_root():
    logger.info("Truy cập endpoint /")
    return {
        "message": "Welcome to EZ4GEAR E-Commerce API",
        "docs": "/api/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
