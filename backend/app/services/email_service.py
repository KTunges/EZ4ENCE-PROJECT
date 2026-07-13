import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import List, Optional
from datetime import datetime
from app.config import settings

logger = logging.getLogger(__name__)

def get_order_html_template(order_id: str, customer_name: str, customer_email: str, 
                            address: str, items: List[dict], total_amount: float, 
                            payment_method: str, shipping_fee: float = 0, discount_amount: float = 0) -> str:
    
    items_html = ""
    for item in items:
        # Expected keys in item: name, quantity, price
        price_formatted = f"{int(item['price']):,} ₫".replace(",", ".")
        item_total = f"{int(item['price'] * item['quantity']):,} ₫".replace(",", ".")
        
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #f8fafc;">
                <strong>{item['name']}</strong>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #f8fafc; text-align: center;">{item['quantity']}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #f8fafc; text-align: right;">{price_formatted}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #00dcff; text-align: right; font-weight: bold;">{item_total}</td>
        </tr>
        """

    subtotal = sum(item['price'] * item['quantity'] for item in items)
    subtotal_formatted = f"{subtotal:,} ₫".replace(",", ".")
    shipping_formatted = f"{int(shipping_fee):,} ₫".replace(",", ".")
    discount_formatted = f"-{int(discount_amount):,} ₫".replace(",", ".") if discount_amount > 0 else "0 ₫"
    total_formatted = f"{int(total_amount):,} ₫".replace(",", ".")
    
    date_str = datetime.now().strftime("%d/%m/%Y %H:%M")

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #03050c; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #0a0e17; border: 1px solid #1e293b; padding: 20px; }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .logo {{ color: #00dcff; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-decoration: none; }}
            .title {{ color: #f8fafc; font-size: 22px; margin-top: 20px; }}
            .content {{ padding: 20px 0; color: #94a3b8; font-size: 15px; line-height: 1.6; }}
            .info-box {{ background-color: rgba(0, 220, 255, 0.05); border: 1px solid rgba(0, 220, 255, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px; }}
            .info-box p {{ margin: 5px 0; color: #e2e8f0; }}
            .info-label {{ color: #00dcff; font-weight: bold; width: 130px; display: inline-block; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th {{ text-align: left; padding: 12px; background-color: #0f172a; color: #94a3b8; border-bottom: 2px solid #1e293b; }}
            .totals-row td {{ padding: 10px 12px; color: #94a3b8; text-align: right; }}
            .final-total td {{ padding: 15px 12px; color: #00dcff; font-size: 18px; font-weight: bold; border-top: 1px solid #1e293b; }}
            .footer {{ text-align: center; padding-top: 20px; border-top: 1px solid #1e293b; color: #64748b; font-size: 13px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">EZ4GEAR</div>
                <div class="title">XÁC NHẬN ĐƠN HÀNG</div>
            </div>
            
            <div class="content">
                <p>Xin chào <strong>{customer_name}</strong>,</p>
                <p>Cảm ơn bạn đã mua sắm tại EZ4GEAR! Đơn hàng của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết đơn hàng của bạn.</p>
                
                <div class="info-box">
                    <p><span class="info-label">Mã đơn hàng:</span> #{order_id[:8].upper()}</p>
                    <p><span class="info-label">Ngày đặt hàng:</span> {date_str}</p>
                    <p><span class="info-label">Phương thức:</span> {payment_method}</p>
                    <p><span class="info-label">Người nhận:</span> {customer_name}</p>
                    <p><span class="info-label">Giao đến:</span> {address}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th style="text-align: center;">SL</th>
                            <th style="text-align: right;">Đơn giá</th>
                            <th style="text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr class="totals-row">
                            <td colspan="3">Tạm tính:</td>
                            <td>{subtotal_formatted}</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3">Phí vận chuyển:</td>
                            <td>{shipping_formatted}</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3">Khuyến mãi:</td>
                            <td style="color: #ff2d78;">{discount_formatted}</td>
                        </tr>
                        <tr class="final-total">
                            <td colspan="3">TỔNG CỘNG:</td>
                            <td>{total_formatted}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <p style="margin-top: 30px;">Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thời gian giao hàng. Nếu có bất kỳ thắc mắc nào, vui lòng phản hồi lại email này.</p>
            </div>
            
            <div class="footer">
                <p>&copy; {datetime.now().year} EZ4GEAR - Gaming & Tech Store. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def send_order_confirmation_email(order, user, address_model):
    """
    Sends an order confirmation email asynchronously.
    Should be called via BackgroundTasks to avoid blocking the API response.
    """
    try:
        sender_email = settings.SMTP_EMAIL
        sender_password = settings.SMTP_PASSWORD
        
        if not sender_email or not sender_password:
            logger.warning("SMTP credentials not configured. Skipping email notification.")
            return False
            
        receiver_email = user.email
        if not receiver_email:
            logger.warning("User does not have an email address. Skipping.")
            return False

        # Format Address
        full_address = f"{address_model.address_line}, {address_model.ward}, {address_model.district}, {address_model.city}"
        
        # Format Items
        items_list = []
        for item in order.items:
            items_list.append({
                "name": item.product_name,
                "quantity": item.quantity,
                "price": float(item.price_at_purchase)
            })
            
        html_content = get_order_html_template(
            order_id=order.id,
            customer_name=address_model.full_name or user.full_name or "Khách hàng",
            customer_email=receiver_email,
            address=full_address,
            items=items_list,
            total_amount=float(order.total_amount),
            payment_method=order.payment_method,
            shipping_fee=float(order.shipping_fee) if order.shipping_fee else 0,
            discount_amount=float(order.discount_amount) if order.discount_amount else 0
        )
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[EZ4GEAR] Xác nhận đơn hàng #{order.id[:8].upper()}"
        msg['From'] = f"EZ4GEAR <{sender_email}>"
        msg['To'] = receiver_email
        
        msg.attach(MIMEText(html_content, 'html'))
        
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            
        logger.info(f"Order confirmation email sent to {receiver_email} for order {order.id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send order email: {str(e)}")
        return False

def get_order_status_html_template(order_id: str, customer_name: str, new_status: str, cancel_reason: str = "") -> str:
    date_str = datetime.now().strftime("%d/%m/%Y %H:%M")
    
    status_messages = {
        "CONFIRMED": ("ĐÃ XÁC NHẬN", "Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.", "#00dcff"),
        "SHIPPING": ("ĐANG GIAO HÀNG", "Đơn hàng của bạn đang được giao đến bạn. Vui lòng chú ý điện thoại.", "#f59e0b"),
        "DELIVERED": ("ĐÃ GIAO THÀNH CÔNG", "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm tại EZ4GEAR!", "#10b981"),
        "CANCELLED": ("ĐÃ HUỶ", "Đơn hàng của bạn đã bị huỷ.", "#ef4444")
    }
    
    status_title, status_desc, status_color = status_messages.get(
        new_status, ("CẬP NHẬT TRẠNG THÁI", f"Đơn hàng của bạn đã chuyển sang trạng thái: {new_status}", "#00dcff")
    )
    
    cancel_html = f'<p><span class="info-label">Lý do huỷ:</span> <span style="color: #ef4444;">{cancel_reason}</span></p>' if new_status == "CANCELLED" and cancel_reason else ""

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #03050c; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #0a0e17; border: 1px solid #1e293b; padding: 20px; }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }}
            .logo {{ color: #00dcff; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-decoration: none; }}
            .title {{ color: {status_color}; font-size: 22px; margin-top: 20px; }}
            .content {{ padding: 20px 0; color: #94a3b8; font-size: 15px; line-height: 1.6; }}
            .info-box {{ background-color: rgba(0, 220, 255, 0.05); border: 1px solid rgba(0, 220, 255, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px; }}
            .info-box p {{ margin: 5px 0; color: #e2e8f0; }}
            .info-label {{ color: #00dcff; font-weight: bold; width: 130px; display: inline-block; }}
            .footer {{ text-align: center; padding-top: 20px; border-top: 1px solid #1e293b; color: #64748b; font-size: 13px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">EZ4GEAR</div>
                <div class="title">{status_title}</div>
            </div>
            
            <div class="content">
                <p>Xin chào <strong>{customer_name}</strong>,</p>
                <p>{status_desc}</p>
                
                <div class="info-box">
                    <p><span class="info-label">Mã đơn hàng:</span> #{order_id[:8].upper()}</p>
                    <p><span class="info-label">Thời gian cập nhật:</span> {date_str}</p>
                    {cancel_html}
                </div>
                
                <p style="margin-top: 30px;">Bạn có thể theo dõi chi tiết đơn hàng trên website của chúng tôi. Nếu có bất kỳ thắc mắc nào, vui lòng phản hồi lại email này.</p>
            </div>
            
            <div class="footer">
                <p>&copy; {datetime.now().year} EZ4GEAR - Gaming & Tech Store. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def send_order_status_email(order, user, address_model, new_status: str, cancel_reason: str = ""):
    """
    Sends an email when order status changes.
    Should be called via BackgroundTasks to avoid blocking the API response.
    """
    try:
        sender_email = settings.SMTP_EMAIL
        sender_password = settings.SMTP_PASSWORD
        
        if not sender_email or not sender_password:
            logger.warning("SMTP credentials not configured. Skipping email notification.")
            return False
            
        receiver_email = user.email
        if not receiver_email:
            return False

        customer_name = address_model.full_name or user.full_name or "Khách hàng"
        html_content = get_order_status_html_template(
            order_id=order.id,
            customer_name=customer_name,
            new_status=new_status,
            cancel_reason=cancel_reason
        )
        
        status_labels = {
            "CONFIRMED": "Đã xác nhận",
            "SHIPPING": "Đang giao",
            "DELIVERED": "Đã giao thành công",
            "CANCELLED": "Đã huỷ"
        }
        status_vn = status_labels.get(new_status, new_status)
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[EZ4GEAR] Đơn hàng #{order.id[:8].upper()} - {status_vn}"
        msg['From'] = f"EZ4GEAR <{sender_email}>"
        msg['To'] = receiver_email
        
        msg.attach(MIMEText(html_content, 'html'))
        
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            
        logger.info(f"Order status email sent to {receiver_email} for order {order.id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send order status email: {str(e)}")
        return False
