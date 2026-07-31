from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.routers.auth import get_current_admin, get_current_super_admin

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"],
    dependencies=[Depends(get_current_super_admin)]
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

    # 7. Order Status Distribution
    status_counts = db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    order_status_distribution = [{"name": s.value if hasattr(s, 'value') else s, "value": c} for s, c in status_counts]

    # 8. Top 5 Selling Products
    from app.models.order import OrderItem
    from app.models.product import ProductSKU
    top_products_db = db.query(Product.name, func.sum(OrderItem.quantity).label('total_sold')).\
        join(ProductSKU, Product.id == ProductSKU.product_id).\
        join(OrderItem, ProductSKU.id == OrderItem.sku_id).\
        group_by(Product.id).\
        order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()
    top_products = [{"name": p, "sold": s} for p, s in top_products_db]

    # 9. Low Stock Alerts (< 10)
    low_stock_db = db.query(Product.name, ProductSKU.sku_code, ProductSKU.stock_quantity).\
        join(ProductSKU, Product.id == ProductSKU.product_id).\
        filter(ProductSKU.stock_quantity < 10, ProductSKU.stock_quantity > 0).\
        order_by(ProductSKU.stock_quantity.asc()).limit(5).all()
    low_stock_items = [{"product_name": p, "sku_code": sc, "stock": st} for p, sc, st in low_stock_db]

    # 10. Average Order Value
    aov = total_revenue / total_orders if total_orders > 0 else 0

    # 11. New Customers in period
    today = datetime.now().date()
    if period == "year":
        start_date = today.replace(day=1) - timedelta(days=365)
    elif period == "month":
        start_date = today - timedelta(days=29)
    else:
        start_date = today - timedelta(days=6)
        
    new_customers = db.query(User).filter(
        User.role == 'USER',
        func.date(User.created_at) >= start_date
    ).count()

    # 12. Recent Reviews
    from app.models.review import Review
    recent_reviews_db = db.query(Review, User.full_name, Product.name).\
        join(User, Review.user_id == User.id).\
        join(ProductSKU, Review.sku_id == ProductSKU.id).\
        join(Product, ProductSKU.product_id == Product.id).\
        order_by(Review.created_at.desc()).limit(5).all()
        
    recent_reviews = []
    for r, u_name, p_name in recent_reviews_db:
        recent_reviews.append({
            "id": r.id,
            "user_name": u_name,
            "product_name": p_name,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat()
        })

    # 13. Sales by Category
    from app.models.category import Category
    sales_by_category_db = db.query(Category.name, func.sum(OrderItem.price_at_purchase * OrderItem.quantity)).\
        join(Product, Category.id == Product.category_id).\
        join(ProductSKU, Product.id == ProductSKU.product_id).\
        join(OrderItem, ProductSKU.id == OrderItem.sku_id).\
        join(Order, OrderItem.order_id == Order.id).\
        filter(Order.status == 'DELIVERED', func.date(Order.created_at) >= start_date).\
        group_by(Category.name).all()
        
    sales_by_category = [{"name": cat_name, "value": float(sales or 0)} for cat_name, sales in sales_by_category_db]

    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "activeProducts": active_products,
        "totalCustomers": total_customers,
        "revenueChart": revenue_chart,
        "recentOrders": latest_orders,
        "orderStatusDistribution": order_status_distribution,
        "topProducts": top_products,
        "lowStockItems": low_stock_items,
        "averageOrderValue": aov,
        "newCustomers": new_customers,
        "recentReviews": recent_reviews,
        "salesByCategory": sales_by_category
    }
