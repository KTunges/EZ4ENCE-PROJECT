import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="header-logo text-gradient" style={{ fontSize: '24px' }}>
              EZ4ENCE
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
            <h3 className="footer-title">Liên Hệ</h3>
            <div className="footer-links">
              <p style={{ color: 'var(--text-muted)' }}>Hotline: 1900 xxxx</p>
              <p style={{ color: 'var(--text-muted)' }}>Email: support@ez4ence.vn</p>
              <p style={{ color: 'var(--text-muted)' }}>Địa chỉ: 123 Đường X, Quận Y, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EZ4ENCE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
