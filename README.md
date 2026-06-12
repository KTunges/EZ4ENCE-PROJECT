# ⚡ EZ4ENCE — Gaming & Tech E-Commerce Platform

> Nền tảng thương mại điện tử chuyên về linh kiện máy tính, Gaming Gear và Custom PC cao cấp. Được xây dựng với giao diện **Cyberpunk / Sci-Fi** kết hợp mô hình 3D tương tác, Layout Bento Box hiện đại và hệ thống CI tự động.

---

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng Nổi Bật](#tính-năng-nổi-bật)
- [Tech Stack](#tech-stack)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Cài Đặt & Chạy](#cài-đặt--chạy)
- [CI / CD Pipeline](#ci--cd-pipeline)
- [Biến Môi Trường](#biến-môi-trường)

---

## Tổng Quan

**EZ4ENCE** là hệ thống e-commerce full-stack được thiết kế dành riêng cho game thủ và những người đam mê công nghệ:

- 🖥️ **Frontend**: Trải nghiệm UI/UX mang hơi hướng tương lai với hiệu ứng Glitch, Cyber Particle Background, hệ thống Banner hiển thị theo phong cách **Bento Box**, Thanh thông báo chạy ngang (Marquee) bám dính (Sticky), và mô hình 3D Gamepad tương tác.
- ⚙️ **Backend**: RESTful API mạnh mẽ, tốc độ cao được tối ưu bằng FastAPI, xử lý xác thực JWT, quản lý sản phẩm, giỏ hàng.
- 🗄️ **Database**: PostgreSQL với kiến trúc dữ liệu chuẩn thương mại điện tử.

---

## Tính Năng Nổi Bật

- **Bento Banners**: Hệ thống lưới banner quảng cáo hiện đại (Grid 3x3) tích hợp slider chuyển ảnh siêu mượt bằng `framer-motion`.
- **Sticky Top Marquee**: Dải băng chuyền Flash Sale chạy ngang màn hình, luôn bám dính lấy thanh điều hướng khi cuộn chuột.
- **Sticky Sidebar**: Thanh danh mục sản phẩm (Category Sidebar) thông minh, tự động cuộn độc lập khi nội dung quá dài.
- **3D Product Viewer**: Hiển thị mô hình thiết bị 3D trực tiếp trên trình duyệt web bằng Three.js.
- **Automated CI/CD**: Tích hợp GitHub Actions tự động chạy ESLint (Frontend) và Pytest (Backend) trên mỗi lần Push hoặc tạo Pull Request.

---

## Tech Stack

| Layer     | Công Nghệ                                      |
|-----------|------------------------------------------------|
| Frontend  | React 19, Vite, React Router DOM, Framer Motion|
| UI / 3D   | Vanilla CSS Modules, Three.js, React Three Fiber|
| Backend   | Python 3.13, FastAPI, Uvicorn                  |
| ORM       | SQLAlchemy 2.0, Alembic                        |
| Database  | PostgreSQL                                     |
| CI/CD     | GitHub Actions (Lint, Pytest, Build check)     |

---

## Cấu Trúc Dự Án

```
EZ4ENCE/
├── .github/workflows/         # File cấu hình CI/CD (ci.yml, cd.yml)
├── frontend/                  # React + Vite App
│   ├── public/
│   │   └── models/            # File mô hình 3D (.glb)
│   └── src/
│       ├── components/
│       │   ├── 3d/            # GamepadScene, GamepadModel
│       │   ├── layout/        # Header, Footer, MainLayout
│       │   └── ui/            # BentoBanners, TopMarquee, CyberBackground...
│       ├── pages/             # Home, Products, BuildPC...
│       └── utils/             # api.js
│
├── backend/                   # FastAPI App
│   ├── app/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # API endpoints
│   │   └── main.py            # Entry point FastAPI
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Unit tests với Pytest
│   └── requirements.txt
│
└── database/
    └── ez4ence_schema.sql     # Schema PostgreSQL export
```

---

## Cài Đặt & Chạy

### 1. Database (PostgreSQL)

```bash
# Đăng nhập PostgreSQL
psql -U postgres
# Tạo Database
CREATE DATABASE ez4ence;
\q

# Import dữ liệu mẫu
psql -h localhost -U postgres -d ez4ence -f database/ez4ence_schema.sql
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Hoặc venv\Scripts\activate trên Windows
pip install -r requirements.txt

# Tạo file .env và điền DATABASE_URL (xem phần Biến Môi Trường)

# Khởi động server (Chạy tại port 8000)
uvicorn app.main:app --reload --port 8000
```
*(Swagger UI Docs: `http://localhost:8000/api/docs`)*

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install

# Khởi động Frontend
npm run dev
```

---

## CI / CD Pipeline

Dự án này sử dụng **GitHub Actions** để đảm bảo chất lượng code:
- **Frontend Job**: Cài đặt dependencies, chạy `npm run lint` để kiểm tra chuẩn React Hooks, và chạy `npm run build` để kiểm tra lỗi biên dịch.
- **Backend Job**: Thiết lập Python 3.13, kiểm tra Syntax, và chạy toàn bộ unit tests bằng `pytest`.

> *Quy trình CI sẽ tự động kích hoạt mỗi khi có code mới được đẩy lên nhánh `main` hoặc `develop`.*

---

## Biến Môi Trường

Tạo file `.env` tại thư mục `backend/`:

```env
# Chuỗi kết nối Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ez4ence

# Chuẩn bảo mật
JWT_SECRET=your_super_secret_key_here
PORT=8000
```

---

<p align="center">Made with ⚡ by EZ4ENCE Team</p>
