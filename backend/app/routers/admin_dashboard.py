from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.routers.auth import get_current_admin

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/stats")
def get_dashboard_stats(period: str = "week", db: Session = Depends(get_db)):
    # 1. Total Revenue (from DELIVERED orders)
    # If we want to consider all successful orders (e.g. status='DELIVERED')
    revenue_result = db.query(func.sum(Order.total_amount)).filter(Order.status == 'DELIVERED').scalar()
    total_revenue = float(revenue_result or 0)

    # 2. Total Orders
    total_orders = db.query(Order).count()

    # 3. Active Products
    active_products = db.query(Product).filter(Product.is_published == True).count()

    # 4. Total Customers (Role = USER)
    total_customers = db.query(User).filter(User.role == 'USER').count()

    # 5. Chart Revenue
    today = datetime.now().date()
    
    if period == "year":
        # Doanh thu 12 tháng qua
        start_date = today.replace(day=1) - timedelta(days=365)
        recent_orders = db.query(Order).filter(
            Order.status == 'DELIVERED',
            func.date(Order.created_at) >= start_date
        ).all()
        
        revenue_by_date = {}
        for i in range(12):
            d = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            revenue_by_date[d.strftime('%Y-%m')] = 0
            
        for order in recent_orders:
            date_str = order.created_at.strftime('%Y-%m')
            if date_str in revenue_by_date:
                revenue_by_date[date_str] += order.total_amount
                
        # Sort and format
        revenue_chart = [
            {"date": k[5:] + "/" + k[:4], "revenue": v} # e.g., "10/2026"
            for k, v in sorted(revenue_by_date.items())
        ]

    elif period == "month":
        # Doanh thu 30 ngày qua
        start_date = today - timedelta(days=29)
        recent_orders = db.query(Order).filter(
            Order.status == 'DELIVERED',
            func.date(Order.created_at) >= start_date
        ).all()
        
        revenue_by_date = {}
        for i in range(30):
            d = start_date + timedelta(days=i)
            revenue_by_date[d.strftime('%Y-%m-%d')] = 0
            
        for order in recent_orders:
            date_str = order.created_at.strftime('%Y-%m-%d')
            if date_str in revenue_by_date:
                revenue_by_date[date_str] += order.total_amount
                
        revenue_chart = [
            {"date": k[-5:], "revenue": v} # e.g., "10-15"
            for k, v in sorted(revenue_by_date.items())
        ]
        
    else: # week
        # Doanh thu 7 ngày qua
        start_date = today - timedelta(days=6)
        recent_orders = db.query(Order).filter(
            Order.status == 'DELIVERED',
            func.date(Order.created_at) >= start_date
        ).all()
        
        revenue_by_date = {}
        for i in range(7):
            d = start_date + timedelta(days=i)
            revenue_by_date[d.strftime('%Y-%m-%d')] = 0
            
        for order in recent_orders:
            date_str = order.created_at.strftime('%Y-%m-%d')
            if date_str in revenue_by_date:
                revenue_by_date[date_str] += order.total_amount
                
        revenue_chart = [
            {"date": k[-5:], "revenue": v}
            for k, v in sorted(revenue_by_date.items())
        ]

    # 6. Recent 5 Orders
    latest_orders_db = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    latest_orders = []
    for o in latest_orders_db:
        latest_orders.append({
            "id": o.id,
            "order_code": o.id,
            "user_name": o.user.full_name if o.user else "Khách vãng lai",
            "total_amount": o.total_amount,
            "status": o.status,
            "created_at": o.created_at.isoformat()
        })

    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "activeProducts": active_products,
        "totalCustomers": total_customers,
        "revenueChart": revenue_chart,
        "recentOrders": latest_orders
    }
