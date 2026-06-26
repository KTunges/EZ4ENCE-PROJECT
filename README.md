# ⚡ EZ4ENCE — Gaming & Tech E-Commerce Platform

> Nền tảng thương mại điện tử chuyên cung cấp thiết bị công nghệ và linh kiện PC (PC Building). Được xây dựng với giao diện **Cyberpunk / Sci-Fi** hiện đại, kết hợp mô hình 3D tương tác, Layout Bento Box và cơ chế tối ưu hóa hiệu năng siêu tốc.

---

## 📋 Mục Lục

- [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
- [Tính Năng Nổi Bật](#tính-năng-nổi-bật)
- [Tech Stack](#tech-stack)
- [Tối Ưu Hóa Hiệu Năng (Performance)](#tối-ưu-hóa-hiệu-năng-performance)
- [Cài Đặt & Chạy (Setup)](#cài-đặt--chạy-setup)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [CI / CD Pipeline](#ci--cd-pipeline)

---

## Tổng Quan Kiến Trúc

Dự án hoạt động theo mô hình **Client-Server (Frontend - Backend tách biệt)**:

1. **Truy Cập (Frontend):** Trình duyệt tải React App với tính năng **Code Splitting (Lazy Load)** giúp trang tải nhanh chớp nhoáng vì chỉ tải tài nguyên cần thiết.
2. **Gọi Dữ Liệu:** Giao diện gửi request API (RESTful) tới Backend FastAPI.
3. **Xử Lý (Backend):** FastAPI tiếp nhận, sử dụng ORM SQLAlchemy để giao tiếp với **PostgreSQL**. Ảnh sản phẩm/User được lấy từ Cloudinary.
4. **Hiển Thị:** Frontend nhận dữ liệu JSON và render ra màn hình qua hệ thống component được tối ưu hóa hiển thị.

---

## Tính Năng Nổi Bật

- 💠 **Bento Banners**: Hệ thống lưới banner quảng cáo hiện đại tích hợp slider chuyển ảnh bằng `framer-motion`.
- ⚡ **Sticky Top Marquee**: Dải băng chuyền Flash Sale chạy ngang màn hình, luôn bám dính khi cuộn trang.
- 📦 **3D Product Viewer**: Hiển thị mô hình thiết bị 3D trực tiếp trên trình duyệt web bằng `Three.js`.
- 🛒 **Giỏ Hàng & Thanh Toán**: Quản lý giỏ hàng qua Context API, tích hợp cổng thanh toán nội địa VNPAY & quốc tế PayPal.
- 💬 **Real-time Chat**: Hệ thống nhắn tin hỗ trợ khách hàng trực tuyến (WebSockets).
- 🛡️ **Quản Trị Hệ Thống (Admin Dashboard)**: Trang quản lý tập trung (Sản phẩm, Đơn hàng, Doanh thu) với biểu đồ `Recharts`.

---

## Tech Stack

| Layer     | Công Nghệ Dạng Ngắn | Mô Tả Chức Năng Cốt Lõi |
|-----------|---------------------|-------------------------|
| **Frontend** | React 19, Vite 8, React Router DOM | Xử lý giao diện (SPA), định tuyến, Code Splitting |
| **UI / 3D**  | Vanilla CSS, Framer Motion, Three.js | Animation siêu mượt, xử lý vật thể 3D, hiệu ứng Cyberpunk |
| **Backend**  | Python, FastAPI, Uvicorn | Xử lý API tốc độ cao (Bất đồng bộ - Asynchronous), Swagger |
| **Database** | PostgreSQL, SQLAlchemy | Lưu trữ dữ liệu quan hệ, ORM tương tác Database |
| **Dịch Vụ**  | Cloudinary, VNPAY, PayPal, Mailchimp | Lưu trữ hình ảnh, cổng thanh toán, email marketing |

---

## Tối Ưu Hóa Hiệu Năng (Performance)

Dự án áp dụng chặt chẽ các tiêu chuẩn tối ưu hóa cao cấp để duy trì tốc độ 60 FPS:
- **GPU Hardware Acceleration:** Ép Card đồ họa xử lý chuyển động CSS (Các hạt `cyber-particle`) thay vì CPU.
- **Glassmorphism Optimization:** Tối ưu hóa bộ lọc `backdrop-filter` để cuộn trang không bị khựng (Drop FPS).
- **React Lazy & Suspense:** Chia nhỏ gói Bundle khổng lồ, tách biệt code Admin và Customer để giảm Time-to-Interactive (TTI).
- **React Memoization:** Sử dụng `React.memo` trên hàng trăm thẻ Card Sản Phẩm để triệt tiêu các vòng lặp Render vô ích.

---

## Cài Đặt & Chạy (Setup)

Dự án có sẵn script cài đặt siêu tốc.

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
API Documentation (Swagger UI): http://localhost:8000/docs

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
│   ├── public/                # Ảnh tĩnh, Mô hình 3D (.glb)
│   └── src/
│       ├── components/        # Các phần tử tái sử dụng (UI, 3D, Layout)
│       ├── context/           # React Context (Auth, Cart, Theme, Wishlist)
│       ├── pages/             # Trang độc lập (chia theo Customer và Admin)
│       └── index.css          # CSS gốc chứa toàn bộ Theme Variables
│
├── backend/                   # FastAPI App
│   ├── app/
│   │   ├── models/            # SQLAlchemy DB Models
│   │   ├── routers/           # API Endpoints (Controllers)
│   │   ├── schemas/           # Pydantic Schemas (Validation)
│   │   └── main.py            # Entry point FastAPI
│   └── tests/                 # Unit tests (Pytest)
│
└── database/
    ├── ez4ence_schema.sql     # File kết xuất Schema PostgreSQL (Backup)
    └── setup_db.*             # Script tự động hóa cài đặt DB
```

---

## CI / CD Pipeline

Dự án sử dụng **GitHub Actions** cho việc kiểm tra chất lượng tự động:
- **Lint Check:** Quét lỗi cú pháp Frontend (`ESLint`).
- **Test Check:** Chạy bộ Unit Test cho Backend (`Pytest`).
- Kích hoạt mỗi khi có lượt `push` hoặc tạo `Pull Request` vào nhánh `main`.
