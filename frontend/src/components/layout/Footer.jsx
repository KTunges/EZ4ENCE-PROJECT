import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" className="footer-logo text-gradient">EZ4ENCE</Link>
            <p className="footer-desc">
              Điểm đến lý tưởng cho dân công nghệ và game thủ.
              Cung cấp linh kiện, PC, Laptop và Gaming Gear chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="social-links">
              <a href="#" className="icon-btn" aria-label="Website"><Globe size={16} /></a>
              <a href="#" className="icon-btn" aria-label="Chat"><MessageCircle size={16} /></a>
              <a href="#" className="icon-btn" aria-label="Telegram"><Send size={16} /></a>
              <a href="#" className="icon-btn" aria-label="GitHub"><Code2 size={16} /></a>
            </div>
          </div>

          {/* Products */}
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

          {/* Support */}
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

          {/* Contact */}
          <div>
            <h3 className="footer-title">Liên Hệ</h3>
            <div className="footer-contact">
              <p>Hotline: 1900 xxxx</p>
              <p>Email: support@ez4ence.vn</p>
              <p>123 Đường X, Quận Y, TP.HCM</p>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} EZ4ENCE — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
