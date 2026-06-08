@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: =============================================
::  EZ4ENCE — Database Setup Script (Windows)
:: =============================================

echo.
echo ================================================
echo    ^  EZ4ENCE -- Database Setup (Windows)
echo ================================================
echo.

:: --- Kiểm tra psql ---
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
    exit /b 1
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
    exit /b 0
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
    exit /b 1
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
        exit /b 1
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
    exit /b 1
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
        echo # Cloudinary (tuy chon)
        echo CLOUDINARY_CLOUD_NAME=
        echo CLOUDINARY_API_KEY=
        echo CLOUDINARY_API_SECRET=
    ) > "!ENV_FILE!"
    echo [OK] Da tao file .env tai: backend\.env
)

:: --- Hoan Tat ---
echo.
echo ================================================
echo    OK  Setup Hoan Tat!
echo ================================================
echo.
echo   Chay Backend:
echo     cd backend
echo     venv\Scripts\activate
echo     pip install -r requirements.txt   ^(lan dau^)
echo     uvicorn app.main:app --reload --port 8000
echo.
echo   Chay Frontend:
echo     cd frontend
echo     npm install ^&^& npm run dev
echo.
echo   Swagger UI: http://localhost:8000/api/docs
echo.
pause
