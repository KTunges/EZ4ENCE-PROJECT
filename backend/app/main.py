import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from loguru import logger

from app.config import settings
from app.routers import auth, products

# Lưu log ra file trong thư mục database, tự động cắt file nếu quá 10MB
logger.add("../database/app.log", rotation="10 MB", level="INFO")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Cấu hình CORS để Frontend (ví dụ React chạy ở port 5173) có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Hoặc cấu hình địa chỉ cụ thể như ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Định tuyến (Routing)
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("Khởi động EZ4ENCE E-Commerce API Server")

@app.get("/")
def read_root():
    logger.info("Truy cập endpoint /")
    return {
        "message": "Welcome to EZ4ENCE E-Commerce API",
        "docs": "/api/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
