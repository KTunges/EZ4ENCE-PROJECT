# ⚡ EZ4GEAR — Gaming & Tech E-Commerce Platform

> Nền tảng thương mại điện tử chuyên cung cấp thiết bị công nghệ và linh kiện PC. Được xây dựng với giao diện **Cyberpunk / Sci-Fi** hiện đại, kết hợp mô hình 3D tương tác, Layout Bento Box và cơ chế tối ưu hóa hiệu năng siêu tốc.


## 📋 Mục Lục

- [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
- [Tính Năng Nổi Bật](#tính-năng-nổi-bật)
- [Tech Stack](#tech-stack)
- [Tối Ưu Hóa Hiệu Năng](#tối-ưu-hóa-hiệu-năng-performance)
- [Cài Đặt & Chạy](#cài-đặt--chạy-setup)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Deployment](#deployment)
- [CI / CD Pipeline](#ci--cd-pipeline)

---

## Tổng Quan Kiến Trúc

Dự án hoạt động theo mô hình **Client-Server (Frontend - Backend tách biệt)**, được triển khai hoàn toàn trên Cloud:

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Netlify    │────▶│     Render       │────▶│   Supabase   │
│  (Frontend)  │ API │    (Backend)     │ SQL │  (Database)  │
│  React+Vite  │◀────│    FastAPI       │◀────│  PostgreSQL  │
└──────────────┘     └──────────────────┘     └──────────────┘
                            │
                     ┌──────┴──────┐
                     │ Cloudinary  │
                     │  (Images)   │
                     └─────────────┘
```

1. **Frontend (Netlify):** Trình duyệt tải React App với **Code Splitting (Lazy Load)** giúp trang tải nhanh vì chỉ tải tài nguyên cần thiết.
2. **Backend (Render):** FastAPI tiếp nhận request, sử dụng ORM SQLAlchemy để giao tiếp với Database.
3. **Database (Supabase):** PostgreSQL trên Cloud lưu trữ toàn bộ dữ liệu sản phẩm, đơn hàng, khách hàng.
4. **Storage (Cloudinary):** Lưu trữ và tối ưu hóa hình ảnh sản phẩm, avatar người dùng.

---

## Tính Năng Nổi Bật

### 🛍️ Khách Hàng
- 💠 **Bento Banners**: Hệ thống lưới banner quảng cáo hiện đại tích hợp slider chuyển ảnh bằng `framer-motion`.
- ⚡ **Sticky Top Marquee**: Dải băng chuyền Flash Sale chạy ngang màn hình, luôn bám dính khi cuộn trang.
- 📦 **3D Product Viewer**: Hiển thị mô hình thiết bị 3D trực tiếp trên trình duyệt web bằng `Three.js`.
- 🛒 **Giỏ Hàng & Thanh Toán**: Quản lý giỏ hàng qua Context API, tích hợp cổng thanh toán VNPAY & PayPal.
- 💬 **Real-time Chat**: Hệ thống nhắn tin hỗ trợ khách hàng trực tuyến (WebSockets).
- 🤖 **AI Tư Vấn Build PC**: Chatbot AI tự động tư vấn cấu hình PC dựa trên ngân sách, powered by Groq AI.
- ❤️ **Wishlist**: Lưu danh sách sản phẩm yêu thích.
- 🔐 **Đăng nhập đa nền tảng**: Email/Password, Google OAuth, Facebook Login.
- 📰 **Tin Tức Công Nghệ**: Trang tin tức cập nhật sản phẩm và xu hướng tech.

### 🛡️ Quản Trị (Admin Dashboard)
- 📊 **Dashboard Tổng Quan**: Biểu đồ doanh thu, đơn hàng, sản phẩm bán chạy bằng `Recharts`.
- 📦 **Quản Lý Sản Phẩm**: CRUD sản phẩm, SKU, hình ảnh, biến thể, giá khuyến mãi.
- 📋 **Quản Lý Đơn Hàng**: Theo dõi trạng thái đơn hàng, lịch sử cập nhật.
- 👥 **Quản Lý Nhân Viên**: Phân quyền (Super Admin, Sales, Inventory).
- 🏭 **Quản Lý Kho Hàng**: Nhập/Xuất kho, Nhà cung cấp, Phiếu nhập kho.
- 🎯 **Marketing**: Banner quảng cáo, Mã giảm giá, Email Marketing (Mailchimp).
- ⭐ **Quản Lý Đánh Giá**: Duyệt, ẩn, phản hồi đánh giá khách hàng.

---

## Tech Stack

| Layer | Công Nghệ | Mô Tả |
|---|---|---|
| **Frontend** | React 19, Vite 8, React Router DOM | SPA, định tuyến, Code Splitting |
| **UI / 3D** | Vanilla CSS, Framer Motion, Three.js | Animation, 3D, hiệu ứng Cyberpunk |
| **Backend** | Python, FastAPI, Uvicorn | RESTful API bất đồng bộ, Swagger |
| **Database** | PostgreSQL, SQLAlchemy, Alembic | ORM, Migration |
| **Cloud** | Netlify, Render, Supabase | Hosting, Deployment |
| **Dịch Vụ** | Cloudinary, VNPAY, PayPal, Mailchimp, Groq AI | Ảnh, Thanh toán, Email, AI |
| **CI/CD** | GitHub Actions | Lint Check, Unit Test tự động |

---

## Tối Ưu Hóa Hiệu Năng (Performance)

Dự án áp dụng chặt chẽ các tiêu chuẩn tối ưu hóa cao cấp để duy trì tốc độ 60 FPS:
- **GPU Hardware Acceleration:** Ép Card đồ họa xử lý chuyển động CSS (Các hạt `cyber-particle`) thay vì CPU.
- **Glassmorphism Optimization:** Tối ưu hóa bộ lọc `backdrop-filter` để cuộn trang không bị khựng.
- **React Lazy & Suspense:** Chia nhỏ gói Bundle, tách biệt code Admin và Customer để giảm Time-to-Interactive (TTI).
- **React Memoization:** Sử dụng `React.memo` trên hàng trăm thẻ Card Sản Phẩm để triệt tiêu các vòng lặp Render vô ích.

---

## Cài Đặt & Chạy (Setup)

### 1. Khởi Tạo Database (PostgreSQL)

Mở Terminal tại thư mục gốc và chạy 1 trong 2 file sau tuỳ vào Hệ điều hành:

- **Windows:**
  ```cmd
  cd database
  setup_db.bat
  ```
- **macOS / Linux:**
  ```bash
  cd database
  chmod +x setup_db.sh
  ./setup_db.sh
  ```
*(Script sẽ tự động kết nối PostgreSQL, tạo CSDL `EZ4ENCE`, Import Schema mới nhất và sinh file `.env` cho Backend)*

### 2. Khởi Chạy Backend (FastAPI)

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation (Swagger UI): http://localhost:8000/api/docs

### 3. Khởi Chạy Frontend (React)

Mở 1 Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Trang chủ: http://localhost:5173

---

## Cấu Trúc Dự Án

```
EZ4ENCE/
├── frontend/                  # React + Vite App (Cửa hàng & Trang Quản Trị)
│   ├── public/                # Ảnh tĩnh, Mô hình 3D (.glb), _redirects
│   └── src/
│       ├── components/        # Các phần tử tái sử dụng (UI, 3D, Layout)
│       ├── context/           # React Context (Auth, Cart, Theme, Wishlist)
│       ├── pages/             # Trang độc lập (chia theo Customer và Admin)
│       ├── services/          # API services (axios)
│       └── index.css          # CSS gốc chứa toàn bộ Theme Variables
│
├── backend/                   # FastAPI App
│   ├── app/
│   │   ├── models/            # SQLAlchemy DB Models (22 bảng)
│   │   ├── routers/           # API Endpoints (Controllers)
│   │   ├── schemas/           # Pydantic Schemas (Validation)
│   │   ├── services/          # Business Logic (AI, Email, Payment)
│   │   └── main.py            # Entry point FastAPI
│   ├── alembic/               # Database Migrations
│   └── tests/                 # Unit tests (Pytest)
│
├── database/
│   ├── ez4ence_schema.sql     # File kết xuất Schema PostgreSQL (Backup)
│   └── setup_db.*             # Script tự động hóa cài đặt DB
│
└── .github/workflows/
    └── ci.yml                 # GitHub Actions CI Pipeline
```

---

## Deployment

| Thành Phần | Nền Tảng | Ghi Chú |
|---|---|---|
| Frontend | **Netlify** | Auto-deploy từ branch `main` |
| Backend | **Render** | Auto-deploy từ branch `main`, Free Tier (spin-down sau 15 phút) |
| Database | **Supabase** | PostgreSQL trên Cloud, Free Tier |
| Images | **Cloudinary** | CDN tối ưu hóa ảnh tự động |
| Uptime | **Cron-job.org** | Ping Backend mỗi 10 phút để chống spin-down |

---

## CI / CD Pipeline

Dự án sử dụng **GitHub Actions** cho việc kiểm tra chất lượng tự động:
- **Lint Check:** Quét lỗi cú pháp Frontend (`ESLint`).
- **Test Check:** Chạy bộ Unit Test cho Backend (`Pytest`).
- Kích hoạt mỗi khi có lượt `push` hoặc tạo `Pull Request` vào nhánh `main`.
- **Continuous Deployment:** Netlify và Render tự động nhận diện code mới và deploy.

---

## 📄 License

Dự án này được phát triển phục vụ mục đích học tập và nghiên cứu.

© 2026 EZ4GEAR. All rights reserved.
