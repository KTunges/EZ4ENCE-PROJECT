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
              <Link to="/products?category=laptop-gaming">Laptop Gaming</Link>
              <Link to="/products?category=pc">PC Lắp Ráp</Link>
              <Link to="/products?category=bàn-phím">Bàn phím cơ</Link>
              <Link to="/products?category=chuot">Chuột Gaming</Link>
              <Link to="/products?category=màn-hình">Màn hình</Link>
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
            <h3 className="footer-title">Hệ Thống Cửa Hàng</h3>
            <div className="footer-desc" style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px', fontSize: '14px' }}>Showroom Hà Nội</strong>
                <span style={{ fontSize: '13px' }}>[Đang cập nhật...]</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px', fontSize: '14px' }}>Showroom TP.HCM</strong>
                <span style={{ fontSize: '13px' }}>[Đang cập nhật...]</span>
              </div>
              <div style={{ marginTop: '4px', padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--cyan)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Giờ mở cửa:</strong>
                <span style={{ fontSize: '13px' }}>08:30 - 21:30 (Tất cả các ngày trong tuần)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EZ4GEAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
