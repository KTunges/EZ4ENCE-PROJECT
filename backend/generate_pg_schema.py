"""
Script xuất schema từ SQLAlchemy models ra file .sql tương thích PostgreSQL.
Chạy: python generate_pg_schema.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, create_mock_engine
from sqlalchemy.schema import CreateTable, CreateIndex
from app.database import Base
import app.models  # Import tat ca models

# Dung PostgreSQL dialect de sinh cu phap SQL dung chuan Postgres
pg_engine = create_mock_engine("postgresql://", executor=lambda *a, **kw: None)

output_lines = []
output_lines.append("-- =============================================")
output_lines.append("-- EZ4ENCE E-Commerce Database Schema")
output_lines.append("-- Generated for PostgreSQL")
output_lines.append("-- =============================================")
output_lines.append("")

# Tạo các kiểu ENUM trước (PostgreSQL yêu cầu tạo type riêng)
output_lines.append("-- ENUM Types")
output_lines.append("DO $$ BEGIN")
output_lines.append("    CREATE TYPE role AS ENUM ('USER', 'ADMIN');")
output_lines.append("EXCEPTION WHEN duplicate_object THEN NULL; END $$;")
output_lines.append("")
output_lines.append("DO $$ BEGIN")
output_lines.append("    CREATE TYPE orderstatus AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED');")
output_lines.append("EXCEPTION WHEN duplicate_object THEN NULL; END $$;")
output_lines.append("")
output_lines.append("DO $$ BEGIN")
output_lines.append("    CREATE TYPE paymentmethod AS ENUM ('COD', 'PAYPAL', 'VNPAY');")
output_lines.append("EXCEPTION WHEN duplicate_object THEN NULL; END $$;")
output_lines.append("")
output_lines.append("DO $$ BEGIN")
output_lines.append("    CREATE TYPE paymentstatus AS ENUM ('UNPAID', 'PAID', 'REFUNDED');")
output_lines.append("EXCEPTION WHEN duplicate_object THEN NULL; END $$;")
output_lines.append("")

# Thứ tự tạo bảng đúng dependency (bảng cha trước, bảng con sau)
table_order = [
    "categories",
    "users",
    "addresses",
    "products",
    "carts",
    "cart_items",
    "orders",
    "order_items",
    "reviews",
    "wishlist_items",
]

for table_name in table_order:
    table = Base.metadata.tables[table_name]
    create_sql = CreateTable(table).compile(pg_engine)
    output_lines.append(f"-- Table: {table_name}")
    output_lines.append(str(create_sql).strip() + ";")
    output_lines.append("")

output_lines.append("-- =============================================")
output_lines.append("-- Schema generation complete!")
output_lines.append("-- =============================================")

sql_content = "\n".join(output_lines)

# Ghi ra file
output_path = os.path.join(os.path.dirname(__file__), "..", "database", "ez4ence_schema.sql")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(sql_content)

print(f"Schema exported to: {os.path.abspath(output_path)}")
print(f"Total tables: {len(table_order)}")
