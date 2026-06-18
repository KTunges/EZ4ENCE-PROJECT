# EZ4GEAR Backend (FastAPI + PostgreSQL)

Dự án này sử dụng **FastAPI** (Python) làm backend framework, **PostgreSQL** làm cơ sở dữ liệu và **Alembic** để quản lý database migrations.

## 🚀 Hướng dẫn Setup cho Contributor (Windows)

Để chạy dự án này trên máy local của bạn, hãy làm theo từng bước dưới đây:

### 1. Yêu cầu hệ thống (Prerequisites)
- Đã cài đặt **Python 3.10+** → [Tải Python](https://www.python.org/downloads/)
- Đã cài đặt **PostgreSQL 15+** (chạy nền ở cổng mặc định 5432) → [Tải PostgreSQL](https://www.postgresql.org/download/windows/)
- Đã có phần mềm **pgAdmin 4** (cài kèm PostgreSQL) để thao tác với DB

### 2. Clone dự án về máy
```bash
git clone https://github.com/<tên-org>/EZ4GEAR-PROJECT.git
cd EZ4GEAR-PROJECT/backend
```

### 3. Tạo Môi trường ảo (Virtual Environment)
Mở Terminal / PowerShell tại thư mục `backend` và chạy:
```powershell
python -m venv .venv
```

### 4. Kích hoạt Môi trường ảo
```powershell
.venv\Scripts\activate
```
> 💡 **Lưu ý**: Nếu Windows báo lỗi *"running scripts is disabled on this system"*, hãy chạy lệnh sau để mở quyền tạm thời (chỉ ảnh hưởng cửa sổ terminal hiện tại, an toàn):
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
> ```
> Sau đó chạy lại lệnh `.venv\Scripts\activate`.

Khi kích hoạt thành công, bạn sẽ thấy chữ **`(.venv)`** xuất hiện ở đầu dòng lệnh.

### 5. Cài đặt Thư viện
```bash
pip install -r requirements.txt
```

### 6. Cấu hình Biến môi trường (.env)
1. Tạo một file tên là `.env` nằm trực tiếp trong thư mục `backend` (file này **không** được đẩy lên GitHub).
2. Copy toàn bộ nội dung mẫu dưới đây dán vào file `.env` đó và **sửa lại mật khẩu PostgreSQL** cho đúng với máy của bạn:

```env
# ==========================================
# ENV VARIABLES
# ==========================================

# SERVER CONFIG
PORT=8000

# DATABASE
# ⚠️ Đổi your_pg_password thành mật khẩu PostgreSQL thật của máy bạn
DATABASE_URL="postgresql://postgres:your_pg_password@localhost:5432/EZ4GEAR"

# AUTHENTICATION
JWT_SECRET="super-secret-jwt-key-change-me-later"
JWT_EXPIRATION="7d"

# CLOUDINARY (Lưu trữ ảnh sản phẩm - Để tạm nếu chưa có tài khoản)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# PAYMENT - VNPAY (Để tạm nếu chưa tích hợp thanh toán)
VNPAY_TMN_CODE="your_vnpay_tmn_code"
VNPAY_HASH_SECRET="your_vnpay_hash_secret"
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:5173/payment/vnpay-return"

# PAYMENT - PAYPAL (Để tạm nếu chưa tích hợp thanh toán)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_MODE="sandbox"
```

### 7. Khởi tạo Database trong PostgreSQL
Bạn cần tạo một database trống tên `EZ4GEAR` trong PostgreSQL. Chọn **một** trong hai cách:

**Cách A: Dùng pgAdmin 4 (Giao diện trực quan)**
1. Mở pgAdmin 4 → Kết nối vào server PostgreSQL.
2. Chuột phải vào **Databases** → **Create** → **Database...**
3. Đặt tên là `EZ4GEAR` → nhấn **Save**.

**Cách B: Dùng script Python có sẵn (Nhanh hơn)**
```powershell
python create_db.py
```
> ⚠️ Script này mặc định dùng mật khẩu `123456`. Nếu mật khẩu PostgreSQL của bạn khác, hãy mở file `create_db.py` và sửa lại trước khi chạy.

### 8. Chạy Migration để tạo các bảng trong Database
Sau khi đã tạo database trống `EZ4GEAR`, chạy lệnh sau để Alembic tự động tạo toàn bộ 10 bảng (users, products, orders, carts...):
```bash
alembic upgrade head
```
Nếu terminal hiển thị dòng `Running upgrade -> a7ca31beda2d... done` tức là **thành công 100%** ✅

### 9. Khởi động Backend Server

**Cách 1: Double-click file `run.bat` (Tiện nhất 🚀)**
> Ở thư mục gốc `EZ4GEAR-PROJECT` có sẵn file `run.bat`. Nhấp đúp chuột vào → chọn `[1] Backend` là server tự chạy!

**Cách 2: Chạy bằng lệnh trong Terminal**
```powershell
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

Khi terminal hiển thị `Application startup complete.` nghĩa là server đã sẵn sàng:
- 🌐 API chạy tại: **http://localhost:8000**
- 📖 Swagger UI (Test API trực quan): **http://localhost:8000/api/docs**

---

## ⚡ Quick Start bằng File .bat (Windows)

Dự án có sẵn 3 file `.bat` ở thư mục gốc, contributor chỉ cần double-click:

| File | Công dụng |
|:---|:---|
| `setup.bat` | 🛠️ **Cài đặt lần đầu** — Tự kiểm tra Python/Node, tạo venv, cài thư viện |
| `run.bat` | 🚀 **Khởi động server** — Chọn Backend, Frontend, hoặc cả hai |
| `test.bat` | 🧪 **Chạy kiểm thử** — Pytest (Backend) + ESLint (Frontend) |

**Quy trình cho contributor mới:**
```
1. Clone repo về máy
2. Double-click setup.bat      → Cài đặt mọi thứ
3. Tạo file backend\.env       → Cấu hình DB (xem bước 6 ở trên)
4. Double-click run.bat → [1]  → Chạy Backend
```

---

## 🛠️ Một số lệnh hữu ích trong quá trình Dev

| Lệnh | Mô tả |
|:---|:---|
| `pytest` | Chạy Unit Test |
| `alembic revision --autogenerate -m "Mô_tả"` | Tạo file migration mới khi sửa/thêm model |
| `alembic upgrade head` | Áp dụng migration mới nhất vào database |
| `alembic downgrade -1` | Rollback (hoàn tác) migration gần nhất |

---

## 📁 Cấu trúc thư mục Dự án

```
EZ4GEAR-PROJECT/
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI: Tự động test khi push/PR
│       └── cd.yml             # CD: Deploy Frontend lên GitHub Pages
├── backend/
│   ├── app/
│   │   ├── core/              # Bảo mật (JWT, mã hóa mật khẩu)
│   │   ├── models/            # SQLAlchemy Models (10 bảng DB)
│   │   ├── routers/           # API Endpoints (auth, products...)
│   │   ├── schemas/           # Pydantic Schemas (validate dữ liệu)
│   │   ├── config.py          # Đọc biến môi trường từ .env
│   │   ├── database.py        # Kết nối PostgreSQL
│   │   └── main.py            # Entry point của FastAPI
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Unit tests
│   ├── .env                   # Biến môi trường (KHÔNG push lên Git)
│   ├── requirements.txt       # Danh sách thư viện Python
│   └── README.md              # File hướng dẫn này
├── frontend/                  # React + Vite
├── database/                  # File DB & logs
├── setup.bat                  # Script cài đặt lần đầu
├── run.bat                    # Script khởi động server
└── test.bat                   # Script chạy test
```

