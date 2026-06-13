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
    echo " [1] Setup Database (Tạo DB, Import Schema, Tạo .env)"
    echo " [2] Seed Data (Cài Python env, thư viện và đổ dữ liệu)"
    echo " [3] Cập nhật ảnh sản phẩm (Sync Cloudinary URLs)"
    echo " [4] Thoát"
    echo ""
    read -p "Chọn [1-4]: " MENU_CHOICE

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
            echo -e "${GREEN}${BOLD}   ✅  Setup Hoàn Tất! Bạn có thể tiếp tục Seed Data bằng Option [2]  ${NC}"
            echo -e "${GREEN}${BOLD}================================================${NC}"
            echo ""
            read -p "Nhấn Enter để quay lại..." dummy
            ;;

        2)
            # --- SEED DATA ---
            clear
            echo ""
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo -e "${CYAN}${BOLD}   ⚡  Đổ dữ liệu mẫu vào Database (Seeding)    ${NC}"
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo ""
            
            SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
            cd "$SCRIPT_DIR/../backend" || exit

            echo -e "${CYAN}[1/3]${NC} Kiểm tra virtual environment..."
            if [ ! -d ".venv" ] && [ ! -d "venv" ]; then
                echo -e "${YELLOW}[INFO]${NC} Chưa có thư mục venv, đang tiến hành tạo..."
                python3 -m venv .venv
            fi

            echo -e "${CYAN}[2/3]${NC} Cài đặt dependencies (có thể mất vài phút)..."
            if [ -f ".venv/bin/activate" ]; then
                source .venv/bin/activate
            elif [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            
            python3 -m pip install --upgrade pip > /dev/null 2>&1
            pip install -r requirements.txt > /dev/null 2>&1

            echo -e "${CYAN}[3/3]${NC} Đang thực thi file seed_db.py..."
            python3 seed_db.py
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}[OK]${NC} Seed dữ liệu thành công!"
            else
                echo -e "${RED}[LỖI]${NC} Có lỗi xảy ra khi seed dữ liệu."
            fi

            cd "$SCRIPT_DIR" || exit
            echo ""
            read -p "Nhấn Enter để quay lại..." dummy
            ;;

        3)
            # --- UPDATE IMAGES ---
            clear
            echo ""
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo -e "${CYAN}${BOLD}   ⚡  Cập nhật link ảnh lên Cloudinary vào Database ${NC}"
            echo -e "${CYAN}${BOLD}================================================${NC}"
            echo ""

            SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
            cd "$SCRIPT_DIR/../backend" || exit

            echo -e "${CYAN}Kiểm tra virtual environment...${NC}"
            if [ ! -d ".venv" ] && [ ! -d "venv" ]; then
                echo -e "${RED}[LỖI]${NC} Vui lòng chạy Seed Data [Option 2] trước để tạo môi trường Python."
                cd "$SCRIPT_DIR" || exit
                read -p "Nhấn Enter để quay lại..." dummy
                continue
            fi

            if [ -f ".venv/bin/activate" ]; then
                source .venv/bin/activate
            elif [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            
            echo -e "${CYAN}Đang thực thi cập nhật...${NC}"
            python3 seed_db.py --update-images
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}[OK]${NC} Cập nhật hình ảnh thành công!"
            else
                echo -e "${RED}[LỖI]${NC} Có lỗi xảy ra khi cập nhật."
            fi

            cd "$SCRIPT_DIR" || exit
            echo ""
            read -p "Nhấn Enter để quay lại..." dummy
            ;;

        4)
            # --- EXIT ---
            echo -e "${GREEN}Tạm biệt!${NC}"
            exit 0
            ;;

        *)
            echo -e "${RED}Lựa chọn không hợp lệ.${NC}"
            sleep 1
            ;;
    esac
done
