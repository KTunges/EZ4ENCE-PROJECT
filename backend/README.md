# EZ4ENCE Backend (FastAPI + PostgreSQL)

Dự án này sử dụng **FastAPI** (Python) làm backend framework, **PostgreSQL** làm cơ sở dữ liệu và **Alembic** để quản lý database migrations.

## 🚀 Hướng dẫn Setup cho Contributor (Windows)

Để chạy dự án này trên máy local của bạn, hãy làm theo từng bước dưới đây:

### 1. Yêu cầu hệ thống (Prerequisites)
- Đã cài đặt **Python 3.10+**
- Đã cài đặt **PostgreSQL** (chạy nền ở cổng mặc định 5432)
- Đã có phần mềm **pgAdmin 4** hoặc **psql** để thao tác với DB

### 2. Cài đặt Môi trường (Virtual Environment)
Mở Terminal / PowerShell tại thư mục `backend` và chạy:
```bash
# Tạo môi trường ảo
python -m venv .venv

# Kích hoạt môi trường ảo (Windows)
.venv\Scripts\activate
```

### 3. Cài đặt Thư viện
Sau khi kích hoạt môi trường ảo (có chữ `(.venv)` ở đầu dòng lệnh), cài đặt các thư viện:
```bash
pip install -r requirements.txt
```

### 4. Cấu hình Biến môi trường (.env)
1. Tạo một file tên là `.env` nằm trực tiếp trong thư mục `backend`.
2. Copy toàn bộ nội dung mẫu dưới đây dán vào file `.env` đó và chỉnh sửa thông tin của bạn (đặc biệt là mật khẩu PostgreSQL):
   ```env
   # ==========================================
   # ENV VARIABLES
   # ==========================================

   # SERVER CONFIG
   PORT=8000

   # DATABASE
   # Đổi your_pg_password thành mật khẩu PostgreSQL thật của máy bạn
   DATABASE_URL="postgresql://postgres:your_pg_password@localhost:5432/EZ4ENCE"

   # AUTHENTICATION
   JWT_SECRET="super-secret-jwt-key-change-me-later"
   JWT_EXPIRATION="7d"

   # CLOUDINARY (Lưu trữ ảnh sản phẩm)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"

   # PAYMENT - VNPAY
   VNPAY_TMN_CODE="your_vnpay_tmn_code"
   VNPAY_HASH_SECRET="your_vnpay_hash_secret"
   VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
   VNPAY_RETURN_URL="http://localhost:5173/payment/vnpay-return"

   # PAYMENT - PAYPAL
   PAYPAL_CLIENT_ID="your_paypal_client_id"
   PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
   PAYPAL_MODE="sandbox"
   ```

### 5. Khởi tạo Database và Migration
Bạn **không cần** phải tạo bảng thủ công bằng tay. Hãy làm như sau:

**Bước 5.1:** Mở pgAdmin 4 hoặc `psql`, tạo một Database trống có tên là `EZ4ENCE`.
*(Hoặc chạy lệnh sau nếu bạn có psql: `psql -U postgres -c "CREATE DATABASE EZ4ENCE;"`)*

**Bước 5.2:** Chạy lệnh Migration của Alembic để tự động tạo 10 bảng vào CSDL:
```bash
alembic upgrade head
```
*(Nếu terminal báo "Running upgrade -> a7ca31beda2d... done" tức là Database đã được tạo thành công 100%)*

### 6. Khởi động Server

Để chạy server Backend, bạn có hai cách tùy thuộc vào cấu hình bảo mật máy tính của bạn:

#### Cách 1: Chạy trực tiếp thông qua môi trường ảo (Đơn giản nhất - Không lo lỗi phân quyền Windows)
Đứng tại thư mục `backend`, chạy lệnh sau để bật API Server:
```powershell
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

#### Cách 2: Kích hoạt môi trường ảo rồi khởi chạy (Lệnh ngắn gọn)
1. Kích hoạt môi trường ảo:
   ```powershell
   .venv\Scripts\activate
   ```
   *💡 **Lưu ý**: Nếu Windows báo lỗi "running scripts is disabled on this system", hãy mở quyền cho PowerShell bằng lệnh: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` rồi chạy lại lệnh activate.*
2. Chạy server bằng lệnh ngắn:
   ```powershell
   uvicorn app.main:app --reload
   ```

---
- API chạy tại: **http://localhost:8000**
- Swagger UI (Docs API): **http://localhost:8000/api/docs**

---

## 🛠️ Một số lệnh hữu ích trong quá trình Dev
- **Chạy Unit Test:** `pytest`
- **Tạo file Migration mới** (Chỉ dùng khi bạn đã sửa/thêm code ở file `app/models/`):
  ```bash
  alembic revision --autogenerate -m "Mô_tả_sự_thay_đổi"
  alembic upgrade head
  ```
