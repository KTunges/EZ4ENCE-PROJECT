@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: =============================================
::  EZ4ENCE — Database Setup Script (Windows)
:: =============================================

:MENU
cls
echo.
echo ================================================
echo    ^  EZ4ENCE -- Database Setup ^& Seed Tool
echo ================================================
echo.
echo Vui long chon chuc nang:
echo [1] Setup Database (Tao DB, Import Schema, Tao .env)
echo [2] Seed Data (Cai Python env, thu vien va do du lieu)
echo [3] Tao tai khoan Admin (Cap quyen Admin)
echo [4] Thoat
echo.
set /p MENU_CHOICE="Chon [1-4]: "

if "!MENU_CHOICE!"=="1" goto SETUP_DB
if "!MENU_CHOICE!"=="2" goto SEED_DATA
if "!MENU_CHOICE!"=="3" goto CREATE_ADMIN
if "!MENU_CHOICE!"=="4" exit /b 0
goto MENU


:SETUP_DB
cls
echo.
echo --- Kiem tra psql ---
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay lenh 'psql'.
    echo.
    echo  Cach khac phuc:
    echo  1. Tai PostgreSQL tai: https://www.postgresql.org/download/windows/
    echo  2. Sau khi cai, them duong dan vao PATH, vi du:
    echo     C:\Program Files\PostgreSQL\16\bin
    echo  3. Mo lai terminal va chay lai script nay.
    pause
    goto MENU
)
for /f "tokens=*" %%v in ('psql --version') do echo [OK] Tim thay: %%v
echo.

:: --- Nhap thong tin ket noi ---
echo [NHAP THONG TIN KET NOI POSTGRESQL]
set /p DB_HOST="  PostgreSQL Host [mac dinh: localhost]: "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_PORT="  PostgreSQL Port [mac dinh: 5432]: "
if "!DB_PORT!"=="" set DB_PORT=5432

set /p DB_USER="  PostgreSQL User [mac dinh: postgres]: "
if "!DB_USER!"=="" set DB_USER=postgres

echo   PostgreSQL Password (bo trong neu khong co):
set /p DB_PASS="  > "

set /p DB_NAME="  Ten Database [mac dinh: ez4ence]: "
if "!DB_NAME!"=="" set DB_NAME=ez4ence

echo.
echo --- Xac nhan thong tin ---
echo   Host     : !DB_HOST!:!DB_PORT!
echo   User     : !DB_USER!
echo   Database : !DB_NAME!
echo.
set /p CONFIRM="Tiep tuc? (y/n): "
if /i "!CONFIRM!" neq "y" (
    echo Da huy.
    pause
    goto MENU
)

set PGPASSWORD=!DB_PASS!

:: --- [1/3] Kiem tra ket noi ---
echo.
echo [1/3] Kiem tra ket noi PostgreSQL...
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -c "\q" >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong ket noi duoc. Kiem tra lai host, port, user va password.
    echo       Dam bao PostgreSQL dang chay (mo Services hoac pgAdmin).
    set PGPASSWORD=
    pause
    goto MENU
)
echo [OK] Ket noi thanh cong!

:: --- [2/3] Tao Database ---
echo.
echo [2/3] Kiem tra va tao database '!DB_NAME!'...

psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -tAc "SELECT 1 FROM pg_database WHERE datname='!DB_NAME!'" 2>nul | findstr /c:"1" >nul
if %errorlevel% equ 0 (
    echo [WARN] Database '!DB_NAME!' da ton tai. Bo qua.
) else (
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -c "CREATE DATABASE !DB_NAME!;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Da tao database '!DB_NAME!'!
    ) else (
        echo [LOI] Khong the tao database.
        set PGPASSWORD=
        pause
        goto MENU
    )
)

:: --- [3/3] Import Schema ---
set SCRIPT_DIR=%~dp0
set SCHEMA_FILE=!SCRIPT_DIR!ez4ence_schema.sql

echo.
echo [3/3] Import schema tu 'ez4ence_schema.sql'...

if not exist "!SCHEMA_FILE!" (
    echo [LOI] Khong tim thay file: !SCHEMA_FILE!
    set PGPASSWORD=
    pause
    goto MENU
)

psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -d !DB_NAME! -f "!SCHEMA_FILE!" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Import schema thanh cong!
) else (
    echo [WARN] Co loi nho khi import (co the bang/enum da ton tai - bo qua duoc).
)

set PGPASSWORD=

:: --- Tao file .env Backend ---
echo.
echo --- Tao file .env cho Backend ---
set ENV_FILE=!SCRIPT_DIR!..\backend\.env
set WRITE_ENV=true

if exist "!ENV_FILE!" (
    set /p OVERWRITE_ENV="File .env da ton tai. Ghi de? (y/n): "
    if /i "!OVERWRITE_ENV!" neq "y" (
        echo Giu nguyen file .env.
        set WRITE_ENV=false
    )
)

if "!WRITE_ENV!"=="true" (
    set /p JWT_SECRET="  JWT_SECRET (Enter de dung mac dinh): "
    if "!JWT_SECRET!"=="" set JWT_SECRET=ez4ence_super_secret_key_please_change_me

    :: Build DATABASE_URL dung cho Windows (co user/pass)
    if "!DB_PASS!"=="" (
        set DB_URL=postgresql://!DB_USER!@!DB_HOST!:!DB_PORT!/!DB_NAME!
    ) else (
        set DB_URL=postgresql://!DB_USER!:!DB_PASS!@!DB_HOST!:!DB_PORT!/!DB_NAME!
    )

    (
        echo DATABASE_URL=!DB_URL!
        echo JWT_SECRET=!JWT_SECRET!
        echo PORT=8000
        echo.
        echo # Redis (tuy chon)
        echo REDIS_HOST=127.0.0.1
        echo REDIS_PORT=6379
        echo.
        echo # Cloudinary (Lưu trữ ảnh)
        echo CLOUDINARY_CLOUD_NAME="dtbbbq4zr"
        echo CLOUDINARY_API_KEY="486763615647488"
        echo CLOUDINARY_API_SECRET="8tFhpi2rN-XiZj2goqmjPZ_27kI"
        echo.
        echo # GOOGLE OAUTH
        echo GOOGLE_CLIENT_ID="259270342314-3vh18nassj4lg7n1gt3gbps75b4gu7c2.apps.googleusercontent.com"
        echo.
        echo # PAYMENT - VNPAY
        echo VNPAY_TMN_CODE="90TFJDF0"
        echo VNPAY_HASH_SECRET="7X20P17TQ0CE7LHKAQY3U3JJ7G2SRS5O"
        echo VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
        echo VNPAY_RETURN_URL="http://localhost:5173/checkout/vnpay-return"
        echo.
        echo # PAYMENT - PAYPAL
        echo PAYPAL_CLIENT_ID="AdhN5CrqrW6kxd7FPrnku7J2Cajq6NoxNha5qpjhW1-WWlItsxtptKMMjxZw1eXcifJswdtovszzeO-X"
        echo PAYPAL_CLIENT_SECRET="EDR5-BVq0ngVI9dRQCJHwwWzDkay5fQ5LqkuFESc0XThkSeghxjGB4W4iqsPrN8dHMe8sjuAb-W_qvh0"
        echo PAYPAL_MODE="sandbox"
        echo.
        echo # FACEBOOK LOGIN
        echo FACEBOOK_APP_ID="1706350950812679"
        echo FACEBOOK_APP_SECRET="92c1a850c3a6eb78afff224b33771d14"
        echo.
        echo # GIAO HÀNG NHANH (GHN) API
        echo GHN_TOKEN="d6fd69b2-66c1-11f1-b8b0-2eefbe471c64"
        echo GHN_SHOP_ID="6488700"
        echo.
        echo # GIAO HÀNG TIẾT KIỆM (GHTK) API
        echo GHTK_TOKEN="47LZuwNJqX2rQkoHaQauSPJru9c9r0HvOO9YrES"
    ) > "!ENV_FILE!"
    echo [OK] Da tao file .env tai: backend\.env
)

:: --- Hoan Tat ---
echo.
echo ================================================
echo    OK  Setup Hoan Tat! Ban co the tiep tuc Seed Data bang cach chon Option [2]
echo ================================================
echo.
pause
goto MENU

:SEED_DATA
cls
echo.
echo ================================================
echo    ^  Do du lieu mau vao Database (Seeding)
echo ================================================
echo.
set SCRIPT_DIR=%~dp0
cd /d "!SCRIPT_DIR!..\backend"

echo [1/3] Kiem tra virtual environment...
if not exist .venv\Scripts\activate (
    echo [INFO] Chua co thu muc .venv, dang tien hanh tao...
    python -m venv .venv
)

echo [2/3] Cai dat dependencies (co the mat vai phut)...
call .venv\Scripts\activate
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt >nul 2>&1

echo [3/3] Dang thuc thi file seed_db.py...
python seed_db.py
if %errorlevel% equ 0 (
    echo [OK] Seed du lieu thanh cong!
) else (
    echo [LOI] Co loi xay ra khi seed du lieu.
)

cd /d "!SCRIPT_DIR!"
pause
goto MENU

:CREATE_ADMIN
cls
echo.
echo ================================================
echo    ^  Tao Tai Khoan Admin
echo ================================================
echo.
set SCRIPT_DIR=%~dp0
cd /d "!SCRIPT_DIR!..\backend"

echo [INFO] Ban can co san mot tai khoan dang ky tren web.
set /p ADMIN_EMAIL="Nhap Email tai khoan muon cap quyen Admin: "
set /p ADMIN_PASS="Nhap mat khau moi (neu muon doi) hoac mat khau cu: "
set /p ADMIN_NAME="Nhap ten hien thi: "

call .venv\Scripts\activate
set PYTHONPATH=.
set PYTHONUTF8=1
python create_admin.py "!ADMIN_EMAIL!" "!ADMIN_PASS!" "!ADMIN_NAME!"

cd /d "!SCRIPT_DIR!"
pause
goto MENU

