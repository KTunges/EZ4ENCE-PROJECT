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

while true; do
    clear
    echo ""
    echo -e "${CYAN}${BOLD}================================================${NC}"
    echo -e "${CYAN}${BOLD}   ⚡  EZ4ENCE — Database Setup & Seed Tool     ${NC}"
    echo -e "${CYAN}${BOLD}================================================${NC}"
    echo ""
    echo "Vui lòng chọn chức năng:"
    echo " [1] Setup Database (Tạo DB, Import Schema & Data, Tạo .env)"
    echo " [2] Tạo tài khoản Admin (Cấp quyền Admin)"
    echo " [3] Thoát"
    echo ""
    read -p "Chọn [1-3]: " MENU_CHOICE

    case $MENU_CHOICE in
        1)
            # --- SETUP DB ---
            clear
            echo ""
            echo -e "${CYAN}--- Kiểm tra psql ---${NC}"
            if ! command -v psql &> /dev/null; then
                echo -e "${RED}[LỖI]${NC} Không tìm thấy lệnh 'psql'."
                echo ""
                echo -e "  Nếu bạn dùng ${BOLD}Postgres.app${NC}: Mở app lên, vào Preferences → CLI Tools → Install."
                echo -e "  Nếu dùng Homebrew: ${CYAN}brew install postgresql${NC}"
                echo -e "  Tải Postgres.app tại: https://postgresapp.com"
                read -p "Nhấn Enter để quay lại..." dummy
                continue
            fi

            echo -e "${GREEN}[OK]${NC} Tìm thấy: $(psql --version)"
            echo ""

            IS_POSTGRESAPP=false
            if psql --version 2>/dev/null | grep -q "Postgres.app"; then
                IS_POSTGRESAPP=true
                echo -e "${CYAN}[INFO]${NC} Phát hiện Postgres.app (không cần user/password)."
            else
                echo -e "${CYAN}[INFO]${NC} Phát hiện PostgreSQL tiêu chuẩn."
            fi
            echo ""

            echo -e "${YELLOW}[NHẬP THÔNG TIN KẾT NỐI]${NC}"
            read -p "  Tên Database [mặc định: EZ4ENCE]: " DB_NAME
            DB_NAME=${DB_NAME:-EZ4ENCE}

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
                continue
            fi

            [ -n "$DB_PASS" ] && export PGPASSWORD="$DB_PASS"

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
                read -p "Nhấn Enter để quay lại..." dummy
                continue
            fi
            echo -e "${GREEN}[OK]${NC} Kết nối thành công!"

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
                    read -p "Nhấn Enter để quay lại..." dummy
                    continue
                fi
            fi

            SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
            SCHEMA_FILE="$SCRIPT_DIR/ez4ence_schema.sql"

            echo ""
            echo -e "${CYAN}[3/3]${NC} Import schema từ '${BOLD}ez4ence_schema.sql${NC}'..."

            if [ ! -f "$SCHEMA_FILE" ]; then
                echo -e "${RED}[LỖI]${NC} Không tìm thấy file schema: $SCHEMA_FILE"
                unset PGPASSWORD
                read -p "Nhấn Enter để quay lại..." dummy
                continue
            fi

            psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE" > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}[OK]${NC} Import schema thành công!"
            else
                echo -e "${YELLOW}[WARN]${NC} Có lỗi nhỏ khi import (có thể bảng/enum đã tồn tại — bỏ qua được)."
            fi

            unset PGPASSWORD

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

# Cloudinary (Lưu trữ ảnh)
CLOUDINARY_CLOUD_NAME="dtbbbq4zr"
CLOUDINARY_API_KEY="486763615647488"
CLOUDINARY_API_SECRET="8tFhpi2rN-XiZj2goqmjPZ_27kI"

# GOOGLE OAUTH
GOOGLE_CLIENT_ID="259270342314-3vh18nassj4lg7n1gt3gbps75b4gu7c2.apps.googleusercontent.com"

# PAYMENT - VNPAY
VNPAY_TMN_CODE="90TFJDF0"
VNPAY_HASH_SECRET="7X20P17TQ0CE7LHKAQY3U3JJ7G2SRS5O"
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:5173/checkout/vnpay-return"

# PAYMENT - PAYPAL
PAYPAL_CLIENT_ID="AdhN5CrqrW6kxd7FPrnku7J2Cajq6NoxNha5qpjhW1-WWlItsxtptKMMjxZw1eXcifJswdtovszzeO-X"
PAYPAL_CLIENT_SECRET="EDR5-BVq0ngVI9dRQCJHwwWzDkay5fQ5LqkuFESc0XThkSeghxjGB4W4iqsPrN8dHMe8sjuAb-W_qvh0"
PAYPAL_MODE="sandbox"

# FACEBOOK LOGIN
FACEBOOK_APP_ID="1706350950812679"
FACEBOOK_APP_SECRET="92c1a850c3a6eb78afff224b33771d14"

# GIAO HÀNG NHANH (GHN) API
GHN_TOKEN="d6fd69b2-66c1-11f1-b8b0-2eefbe471c64"
GHN_SHOP_ID="6488700"

# GIAO HÀNG TIẾT KIỆM (GHTK) API
GHTK_TOKEN="47LZuwNJqX2rQkoHaQauSPJru9c9r0HvOO9YrES"
EOF
                echo -e "${GREEN}[OK]${NC} Đã tạo file .env tại: backend/.env"
            fi

            echo ""
            echo -e "${GREEN}${BOLD}================================================${NC}"
            echo -e "${GREEN}${BOLD}   ✅  Setup Hoàn Tất! Bạn có thể sử dụng hệ thống ngay.  ${NC}"
            echo -e "${GREEN}${BOLD}================================================${NC}"
            echo ""
            read -p "Nhấn Enter để quay lại..." dummy
            ;;

        2)
            # --- CREATE ADMIN ---
            clear
            echo ""
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo -e "${CYAN}${BOLD}   Tạo Tài Khoản Admin                          ${NC}"
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo ""
            
            SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
            cd "$SCRIPT_DIR/../backend" || exit

            echo -e "${YELLOW}[INFO] Bạn cần có sẵn một tài khoản đã đăng ký trên web.${NC}"
            read -p "Nhập Email tài khoản muốn cấp quyền Admin: " ADMIN_EMAIL
            read -sp "Nhập mật khẩu mới (nếu muốn đổi) hoặc mật khẩu cũ: " ADMIN_PASS
            echo ""
            read -p "Nhập tên hiển thị: " ADMIN_NAME

            if [ -f ".venv/bin/activate" ]; then
                source .venv/bin/activate
            elif [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            
            export PYTHONPATH="."
            export PYTHONUTF8=1
            python3 create_admin.py "$ADMIN_EMAIL" "$ADMIN_PASS" "$ADMIN_NAME"

            cd "$SCRIPT_DIR" || exit
            echo ""
            read -p "Nhấn Enter để quay lại..." dummy
            ;;

        3)
            # --- EXIT ---
            clear
            echo -e "${GREEN}Đã thoát.${NC}"
            exit 0
            ;;

        *)
            echo -e "${RED}[LỖI]${NC} Lựa chọn không hợp lệ!"
            read -p "Nhấn Enter để quay lại..." dummy
            ;;
    esac
done
