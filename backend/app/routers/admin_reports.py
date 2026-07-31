import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductSKU
from app.routers.auth import get_current_admin, get_current_super_admin

router = APIRouter(prefix="/admin/reports", tags=["Admin Reports"])

def export_dataframe(df: pd.DataFrame, filename_prefix: str, format: str):
    """Utility to export dataframe to CSV or XLSX as StreamingResponse."""
    if format not in ["csv", "xlsx"]:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'csv' or 'xlsx'.")

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    filename = f"{filename_prefix}_{timestamp}.{format}"

    if format == "csv":
        stream = io.StringIO()
        df.to_csv(stream, index=False, encoding='utf-8-sig')  # utf-8-sig for Excel compatibility
        response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        return response
    elif format == "xlsx":
        stream = io.BytesIO()
        with pd.ExcelWriter(stream, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Report')
        
        response = StreamingResponse(iter([stream.getvalue()]), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        return response

@router.get("/orders/export")
def export_orders(
    format: str = Query("xlsx", pattern="^(csv|xlsx)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_super_admin)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    
    data = []
    for order in orders:
        customer_name = order.user.full_name if order.user else "Khách vãng lai"
        customer_email = order.user.email if order.user else ""
        
        data.append({
            "Mã đơn hàng": str(order.id)[:8].upper(),
            "Khách hàng": customer_name,
            "Email": customer_email,
            "Ngày đặt": order.created_at.strftime("%Y-%m-%d %H:%M:%S") if order.created_at else "",
            "Trạng thái": order.status.value if order.status else "",
            "Thanh toán": order.payment_status.value if order.payment_status else "",
            "Phương thức TT": order.payment_method.value if order.payment_method else "",
            "Tổng tiền": float(order.total_amount),
            "Phí ship": float(order.shipping_fee) if order.shipping_fee else 0,
            "Giảm giá": float(order.discount_amount) if order.discount_amount else 0,
        })
        
    df = pd.DataFrame(data)
    return export_dataframe(df, "Orders_Report", format)

@router.get("/products/export")
def export_products(
    format: str = Query("xlsx", regex="^(csv|xlsx)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_super_admin)
):
    products = db.query(Product).all()
    
    data = []
    for product in products:
        category_name = product.category.name if product.category else ""
        brand_name = product.brand.name if product.brand else ""
        
        # Calculate total stock
        total_stock = sum(sku.stock for sku in product.skus) if product.skus else 0
        
        data.append({
            "Mã Sản Phẩm": product.product_code,
            "Tên Sản Phẩm": product.name,
            "Danh mục": category_name,
            "Thương hiệu": brand_name,
            "Tổng Tồn Kho": total_stock,
            "Đã Bán": product.sold_count,
            "Đánh Giá": product.rating,
            "Số Lượt Đánh Giá": product.review_count,
            "Trạng Thái": "Hoạt động" if product.is_active else "Ẩn",
            "Ngày Tạo": product.created_at.strftime("%Y-%m-%d") if product.created_at else ""
        })
        
    df = pd.DataFrame(data)
    return export_dataframe(df, "Products_Inventory_Report", format)

@router.get("/revenue/export")
def export_revenue(
    format: str = Query("xlsx", pattern="^(csv|xlsx)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_super_admin)
):
    # Dữ liệu doanh thu có thể dựa trên các đơn hàng đã thanh toán hoặc giao thành công
    from app.models.order import OrderStatus, PaymentStatus
    
    orders = db.query(Order).filter(
        Order.status != OrderStatus.CANCELLED,
        Order.payment_status == PaymentStatus.PAID
    ).order_by(Order.created_at.asc()).all()
    
    data = []
    for order in orders:
        data.append({
            "Ngày Giao Dịch": order.created_at.strftime("%Y-%m-%d") if order.created_at else "",
            "Mã Đơn Hàng": str(order.id)[:8].upper(),
            "Doanh Thu Thuần": float(order.total_amount - (order.shipping_fee or 0)),
            "Phí Vận Chuyển": float(order.shipping_fee or 0),
            "Tổng Thu": float(order.total_amount),
        })
        
    df = pd.DataFrame(data)
    
    # Gom nhóm theo ngày nếu cần thiết (Tùy chọn)
    if not df.empty:
        # Nhóm theo Ngày Giao Dịch
        df_grouped = df.groupby("Ngày Giao Dịch").agg({
            "Doanh Thu Thuần": "sum",
            "Phí Vận Chuyển": "sum",
            "Tổng Thu": "sum"
        }).reset_index()
        return export_dataframe(df_grouped, "Revenue_Daily_Report", format)
    
    return export_dataframe(df, "Revenue_Daily_Report", format)
