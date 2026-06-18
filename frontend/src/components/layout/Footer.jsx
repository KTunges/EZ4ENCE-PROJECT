import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="header-logo text-gradient" style={{ fontSize: '24px' }}>
              EZ4GEAR
            </Link>
            <p className="footer-desc">
              Điểm đến lý tưởng cho dân công nghệ và game thủ.
              Cung cấp linh kiện, PC, Laptop và Gaming Gear chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="flex gap-4" style={{ marginTop: '24px' }}>
              <a href="#" className="icon-btn"><Globe size={18} /></a>
              <a href="#" className="icon-btn"><MessageCircle size={18} /></a>
              <a href="#" className="icon-btn"><Send size={18} /></a>
              <a href="#" className="icon-btn"><Code2 size={18} /></a>
            </div>
            
            <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <p>Hotline: 1900 xxxx</p>
              <p style={{ marginTop: '8px' }}>Email: support@ez4gear.vn</p>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Sản Phẩm</h3>
            <div className="footer-links">
              <Link to="/products?category=laptop">Laptop Gaming</Link>
              <Link to="/products?category=pc">PC Lắp Ráp</Link>
              <Link to="/products?category=keyboard">Bàn phím cơ</Link>
              <Link to="/products?category=mouse">Chuột Gaming</Link>
              <Link to="/products?category=monitor">Màn hình</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Hỗ Trợ</h3>
            <div className="footer-links">
              <Link to="/policy">Chính sách bảo hành</Link>
              <Link to="/shipping">Chính sách vận chuyển</Link>
              <Link to="/return">Chính sách đổi trả</Link>
              <Link to="/faq">Câu hỏi thường gặp</Link>
              <Link to="/contact">Liên hệ</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Nhận Tin Khuyến Mãi</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
              Đăng ký ngay để nhận các mã giảm giá và tin tức phần cứng mới nhất.
            </p>
            <form className="cyber-input-group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                className="cyber-input" 
                placeholder="Nhập email của bạn..." 
                required
              />
              <button type="submit" className="cyber-btn-inside">
                ĐĂNG KÝ
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EZ4GEAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
