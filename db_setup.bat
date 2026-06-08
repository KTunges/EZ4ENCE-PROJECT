@echo off
chcp 65001 >nul 2>&1
title EZ4ENCE - Database Manager

cd /d "%~dp0backend"

:: Kiem tra venv
if not exist ".venv\Scripts\python.exe" (
    echo [X] Chua tim thay moi truong ao (.venv)!
    echo     Hay chay: python -m venv .venv
    echo              pip install -r requirements.txt
    pause
    exit /b 1
)

:menu
cls
echo.
echo ══════════════════════════════════════════════
echo    EZ4ENCE - Database Manager (PostgreSQL)
echo ══════════════════════════════════════════════
echo.
echo   [1] Cai dat lan dau (Tao DB + Migration)
echo   [2] Cap nhat DB     (Chay migration moi nhat)
echo   [3] Xem trang thai  (Migration hien tai)
echo   [4] Rollback        (Hoan tac 1 migration)
echo   [5] Reset DB        (Xoa sach + tao lai tu dau)
echo   [6] Xuat schema SQL (Xuat file .sql)
echo   [0] Thoat
echo.
set /p choice="Nhap lua chon (0-6): "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto upgrade
if "%choice%"=="3" goto status
if "%choice%"=="4" goto rollback
if "%choice%"=="5" goto reset
if "%choice%"=="6" goto schema
if "%choice%"=="0" goto end

echo Lua chon khong hop le!
timeout /t 2 >nul
goto menu

:: ============================================
:: 1. Cai dat lan dau
:: ============================================
:init
echo.
echo --- [1/2] Tao database EZ4ENCE ---
.venv\Scripts\python create_db.py
echo.
echo --- [2/2] Chay migration ---
.venv\Scripts\python -m alembic upgrade head
echo.
echo Hoan tat!
pause
goto menu

:: ============================================
:: 2. Cap nhat DB (khi co migration moi)
:: ============================================
:upgrade
echo.
echo --- Cap nhat database len phien ban moi nhat ---
.venv\Scripts\python -m alembic upgrade head
echo.
echo Hoan tat!
pause
goto menu

:: ============================================
:: 3. Xem trang thai migration
:: ============================================
:status
echo.
echo --- Trang thai migration hien tai ---
.venv\Scripts\python -m alembic current
echo.
echo --- Lich su migration ---
.venv\Scripts\python -m alembic history --verbose
echo.
pause
goto menu

:: ============================================
:: 4. Rollback 1 migration
:: ============================================
:rollback
echo.
echo --- Hoan tac 1 migration gan nhat ---
echo Truoc khi rollback:
.venv\Scripts\python -m alembic current
echo.
set /p confirm="Ban chac chan muon rollback? (y/n): "
if /i not "%confirm%"=="y" goto menu
.venv\Scripts\python -m alembic downgrade -1
echo.
echo Sau khi rollback:
.venv\Scripts\python -m alembic current
echo.
pause
goto menu

:: ============================================
:: 5. Reset DB (xoa sach va tao lai)
:: ============================================
:reset
echo.
echo !! CANH BAO: Thao tac nay se XOA TOAN BO du lieu !!
set /p confirm="Nhap "RESET" de xac nhan: "
if not "%confirm%"=="RESET" (
    echo Da huy.
    pause
    goto menu
)
echo.
echo --- Rollback toan bo migration ---
.venv\Scripts\python -m alembic downgrade base
echo.
echo --- Chay lai migration tu dau ---
.venv\Scripts\python -m alembic upgrade head
echo.
echo Reset hoan tat!
pause
goto menu

:: ============================================
:: 6. Xuat schema SQL
:: ============================================
:schema
echo.
echo --- Xuat schema ra file SQL ---
.venv\Scripts\python generate_pg_schema.py
echo.
pause
goto menu

:end
