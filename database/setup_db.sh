#!/bin/bash

# =============================================
#  EZ4ENCE — Database Setup Script (macOS/Linux)
# =============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}================================================${NC}"
echo -e "${CYAN}${BOLD}   ⚡  EZ4ENCE — Database Setup (macOS/Linux)   ${NC}"
echo -e "${CYAN}${BOLD}================================================${NC}"
echo ""

# --- Kiểm tra psql ---
if ! command -v psql &> /dev/null; then
    echo -e "${RED}[LỖI]${NC} Không tìm thấy lệnh 'psql'."
    echo ""
    echo -e "  Nếu bạn dùng ${BOLD}Postgres.app${NC}: Mở app lên, vào Preferences → CLI Tools → Install."
    echo -e "  Nếu dùng Homebrew: ${CYAN}brew install postgresql${NC}"
    echo -e "  Tải Postgres.app tại: https://postgresapp.com"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Tìm thấy: $(psql --version)"
echo ""

# --- Phát hiện loại cài đặt PostgreSQL ---
IS_POSTGRESAPP=false
if psql --version 2>/dev/null | grep -q "Postgres.app"; then
    IS_POSTGRESAPP=true
    echo -e "${CYAN}[INFO]${NC} Phát hiện Postgres.app (không cần user/password)."
else
    echo -e "${CYAN}[INFO]${NC} Phát hiện PostgreSQL tiêu chuẩn."
fi
echo ""

# --- Thông tin kết nối ---
echo -e "${YELLOW}[NHẬP THÔNG TIN KẾT NỐI]${NC}"

read -p "  Tên Database [mặc định: ez4ence]: " DB_NAME
DB_NAME=${DB_NAME:-ez4ence}

if [ "$IS_POSTGRESAPP" = false ]; then
    read -p "  PostgreSQL Host [mặc định: localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    read -p "  PostgreSQL Port [mặc định: 5432]: " DB_PORT
    DB_PORT=${DB_PORT:-5432}

    read -p "  PostgreSQL User [mặc định: postgres]: " DB_USER
    DB_USER=${DB_USER:-postgres}

    read -sp "  PostgreSQL Password (bỏ trống nếu không có): " DB_PASS
    echo ""
else
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_USER="$(whoami)"
    DB_PASS=""
fi

echo ""
echo -e "${CYAN}--- Xác nhận ---${NC}"
echo -e "  Database : ${BOLD}$DB_NAME${NC}"
echo -e "  Host     : ${BOLD}$DB_HOST:$DB_PORT${NC}"
echo -e "  User     : ${BOLD}$DB_USER${NC}"
echo ""
read -p "Tiếp tục? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo -e "${YELLOW}Đã huỷ.${NC}"
    exit 0
fi

[ -n "$DB_PASS" ] && export PGPASSWORD="$DB_PASS"

# --- [1/3] Kiểm tra kết nối ---
echo ""
echo -e "${CYAN}[1/3]${NC} Kiểm tra kết nối PostgreSQL..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "\q" 2>/dev/null
if [ $? -ne 0 ]; then
    if [ "$IS_POSTGRESAPP" = true ]; then
        echo -e "${RED}[LỖI]${NC} Không kết nối được. Hãy chắc chắn ${BOLD}Postgres.app đang chạy${NC} (icon voi ở menu bar)."
    else
        echo -e "${RED}[LỖI]${NC} Không kết nối được. Kiểm tra lại host, port, user và password."
    fi
    unset PGPASSWORD
    exit 1
fi
echo -e "${GREEN}[OK]${NC} Kết nối thành công!"

# --- [2/3] Tạo Database ---
echo ""
echo -e "${CYAN}[2/3]${NC} Tạo database '${BOLD}$DB_NAME${NC}'..."
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null)

if [ "$DB_EXISTS" == "1" ]; then
    echo -e "${YELLOW}[WARN]${NC} Database '$DB_NAME' đã tồn tại. Bỏ qua."
else
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK]${NC} Đã tạo database '$DB_NAME'!"
    else
        echo -e "${RED}[LỖI]${NC} Không thể tạo database."
        unset PGPASSWORD
        exit 1
    fi
fi

# --- [3/3] Import Schema ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/ez4ence_schema.sql"

echo ""
echo -e "${CYAN}[3/3]${NC} Import schema từ '${BOLD}ez4ence_schema.sql${NC}'..."

if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}[LỖI]${NC} Không tìm thấy file schema: $SCHEMA_FILE"
    unset PGPASSWORD
    exit 1
fi

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK]${NC} Import schema thành công!"
else
    echo -e "${YELLOW}[WARN]${NC} Có lỗi nhỏ khi import (có thể bảng/enum đã tồn tại — bỏ qua được)."
fi

unset PGPASSWORD

# --- Tạo file .env Backend ---
echo ""
echo -e "${CYAN}--- Tạo file .env cho Backend ---${NC}"
ENV_FILE="$SCRIPT_DIR/../backend/.env"
WRITE_ENV=true

if [ -f "$ENV_FILE" ]; then
    read -p "File .env đã tồn tại. Ghi đè? (y/n): " OW
    [[ "$OW" != "y" && "$OW" != "Y" ]] && WRITE_ENV=false && echo -e "${YELLOW}Giữ nguyên .env.${NC}"
fi

if [ "$WRITE_ENV" = true ]; then
    read -p "  JWT_SECRET (Enter để tự tạo ngẫu nhiên): " JWT_SECRET
    [ -z "$JWT_SECRET" ] && JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "ez4ence_jwt_$(date +%s)")

    # Tạo DATABASE_URL đúng theo từng kiểu cài đặt
    if [ "$IS_POSTGRESAPP" = true ] || [ -z "$DB_PASS" ]; then
        DB_URL="postgresql://$DB_HOST:$DB_PORT/$DB_NAME"
    else
        DB_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
    fi

    cat > "$ENV_FILE" <<EOF
DATABASE_URL=$DB_URL
JWT_SECRET=$JWT_SECRET
PORT=8000

# Redis (tuy chon)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Cloudinary (tuy chon)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EOF
    echo -e "${GREEN}[OK]${NC} Đã tạo file .env tại: backend/.env"
fi

# --- Hoàn tất ---
echo ""
echo -e "${GREEN}${BOLD}================================================${NC}"
echo -e "${GREEN}${BOLD}   ✅  Setup Hoàn Tất!                          ${NC}"
echo -e "${GREEN}${BOLD}================================================${NC}"
echo ""
echo -e "  Chạy Backend:"
echo -e "  ${CYAN}cd backend${NC}"
echo -e "  ${CYAN}source venv/bin/activate${NC}"
echo -e "  ${CYAN}pip install -r requirements.txt${NC}   ${YELLOW}(lần đầu)${NC}"
echo -e "  ${CYAN}uvicorn app.main:app --reload --port 8000${NC}"
echo ""
echo -e "  Chạy Frontend:"
echo -e "  ${CYAN}cd frontend${NC}"
echo -e "  ${CYAN}npm install && npm run dev${NC}"
echo ""
echo -e "  Swagger UI: ${BOLD}http://localhost:8000/api/docs${NC}"
echo ""
