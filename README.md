# ⚡ EZ4ENCE — Gaming & Tech E-Commerce Platform

> Nền tảng thương mại điện tử chuyên về linh kiện máy tính, Gaming Gear và Custom PC cao cấp. Được xây dựng với giao diện **Cyberpunk / Sci-Fi** kết hợp mô hình 3D tương tác và nhiều hiệu ứng thị giác tiên tiến.

---

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tech Stack](#tech-stack)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt & Chạy](#cài-đặt--chạy)
  - [Database (PostgreSQL)](#1-database-postgresql)
  - [Backend (FastAPI)](#2-backend-fastapi)
  - [Frontend (React + Vite)](#3-frontend-react--vite)
- [API Endpoints](#api-endpoints)
- [Biến Môi Trường](#biến-môi-trường)

---

## Tổng Quan

**EZ4ENCE** là hệ thống e-commerce full-stack bao gồm:

- 🖥️ **Frontend**: Giao diện Cyberpunk với hiệu ứng Glitch, Chromatic Aberration, Cyber Particle Background, Hacker Text Decrypt, Glowing Timeline và mô hình 3D DualSense tương tác.
- ⚙️ **Backend**: RESTful API xác thực JWT, quản lý sản phẩm, đơn hàng, giỏ hàng và người dùng.
- 🗄️ **Database**: PostgreSQL với schema đầy đủ cho hệ thống e-commerce.

---

## Tech Stack

| Layer     | Công Nghệ                                      |
|-----------|------------------------------------------------|
| Frontend  | React 19, Vite, React Router DOM, Framer Motion |
| 3D        | Three.js, @react-three/fiber, @react-three/drei |
| Backend   | Python, FastAPI, Uvicorn                        |
| ORM       | SQLAlchemy 2.0, Alembic                         |
| Database  | PostgreSQL                                      |
| Auth      | JWT (PyJWT), Passlib + Bcrypt                   |
| Logging   | Loguru                                          |
| Testing   | Pytest, HTTPX                                   |

---

## Cấu Trúc Dự Án

```
EZ4ENCE/
├── frontend/                  # React + Vite App
│   ├── public/
│   │   └── models/            # File mô hình 3D (.glb)
│   └── src/
│       ├── components/
│       │   ├── 3d/            # GamepadScene, GamepadModel
│       │   ├── layout/        # Header, Footer, MainLayout
│       │   └── ui/            # CyberBackground, CyberTimeline, MarqueeBanner
│       ├── context/           # ThemeContext
│       ├── hooks/             # useHackerText
│       ├── pages/             # Home, About
│       └── utils/             # api.js — helper gọi API
│
├── backend/                   # FastAPI App
│   ├── app/
│   │   ├── core/              # security.py (JWT, hashing)
│   │   ├── models/            # SQLAlchemy models (User, Product, Order...)
│   │   ├── routers/           # auth.py, products.py
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── config.py          # Cấu hình từ .env
│   │   ├── database.py        # Kết nối PostgreSQL
│   │   └── main.py            # Entry point FastAPI
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Pytest test suite
│   └── requirements.txt
│
└── database/
    └── ez4ence_schema.sql     # Schema PostgreSQL export
```

---

## Yêu Cầu Hệ Thống

- **Node.js** >= 18
- **Python** >= 3.10
- **PostgreSQL** >= 14
- **pip** hoặc **pipenv**

---

## Cài Đặt & Chạy

### 1. Database (PostgreSQL)

**Bước 1**: Tạo database

```bash
psql -U postgres
```

```sql
CREATE DATABASE ez4ence;
\q
```

**Bước 2**: Import schema

```bash
psql -U postgres -d ez4ence -f database/ez4ence_schema.sql
```

**Hoặc** dùng Alembic migration (sau khi cấu hình `.env` ở bước Backend):

```bash
cd backend
alembic upgrade head
```

---

### 2. Backend (FastAPI)

**Bước 1**: Di chuyển vào thư mục backend

```bash
cd backend
```

**Bước 2**: Tạo và kích hoạt virtual environment

```bash
# Tạo venv
python -m venv venv

# Kích hoạt (macOS/Linux)
source venv/bin/activate

# Kích hoạt (Windows)
venv\Scripts\activate
```

**Bước 3**: Cài đặt dependencies

```bash
pip install -r requirements.txt
```

**Bước 4**: Tạo file `.env` trong thư mục `backend/`

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ez4ence
JWT_SECRET=your_super_secret_key_here
PORT=8000

# Redis (tuỳ chọn)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Cloudinary (tuỳ chọn, dùng để upload ảnh)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Bước 5**: Chạy server

```bash
python -m app.main
```

Hoặc dùng Uvicorn trực tiếp:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

✅ Server chạy tại: `http://localhost:8000`  
📄 Swagger UI Docs: `http://localhost:8000/api/docs`

---

### 3. Frontend (React + Vite)

**Bước 1**: Di chuyển vào thư mục frontend

```bash
cd frontend
```

**Bước 2**: Cài đặt dependencies

```bash
npm install
```

**Bước 3**: Chạy dev server

```bash
npm run dev
```

✅ App chạy tại: `http://localhost:5173`

> **Lưu ý**: Frontend mặc định gọi API tại `http://localhost:8000/api`. Nếu bạn thay đổi port backend, cập nhật lại file `frontend/src/utils/api.js`.

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint             | Mô tả                         |
|--------|----------------------|-------------------------------|
| POST   | `/api/auth/register` | Đăng ký tài khoản mới         |
| POST   | `/api/auth/login`    | Đăng nhập, trả về JWT token   |
| GET    | `/api/auth/me`       | Lấy thông tin user hiện tại   |

### Products (`/api/products`)

| Method | Endpoint                  | Mô tả                    |
|--------|---------------------------|--------------------------|
| GET    | `/api/products/`          | Lấy danh sách sản phẩm   |
| POST   | `/api/products/`          | Tạo sản phẩm mới         |
| GET    | `/api/products/{id}`      | Lấy chi tiết sản phẩm    |

---

## Biến Môi Trường

| Biến                    | Bắt buộc | Mô tả                                         |
|-------------------------|----------|-----------------------------------------------|
| `DATABASE_URL`          | ✅       | Chuỗi kết nối PostgreSQL                      |
| `JWT_SECRET`            | ✅       | Khoá bí mật để ký JWT token                   |
| `PORT`                  | ❌       | Port chạy server (mặc định: `8000`)           |
| `REDIS_HOST`            | ❌       | Host Redis (mặc định: `127.0.0.1`)            |
| `REDIS_PORT`            | ❌       | Port Redis (mặc định: `6379`)                 |
| `CLOUDINARY_CLOUD_NAME` | ❌       | Cloud name Cloudinary (upload ảnh)            |
| `CLOUDINARY_API_KEY`    | ❌       | API Key Cloudinary                            |
| `CLOUDINARY_API_SECRET` | ❌       | API Secret Cloudinary                         |

---

## 🔬 Chạy Tests (Backend)

```bash
cd backend
pytest
```

---

## 📝 Ghi Chú

- Logs backend được ghi vào file `database/app.log` và tự động rotate khi đạt 10MB.
- CORS hiện tại được cấu hình `allow_origins=["*"]` — chỉ phù hợp cho môi trường dev. Khi deploy production cần đổi lại thành domain cụ thể.
- Mô hình 3D DualSense (`.glb`) nằm tại `frontend/public/models/dualsense.glb`.

---

<p align="center">Made with ⚡ by EZ4ENCE Team</p>
