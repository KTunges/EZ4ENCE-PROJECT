import { motion } from 'framer-motion';

export default function SidebarPromo() {
  return (
    <>
      <style>{`
        .sidebar-promo-container {
          margin-top: 24px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(0, 220, 255, 0.3);
          box-shadow: 0 0 15px rgba(0, 220, 255, 0.1);
          display: flex;
          flex-direction: column;
        }
        .sidebar-promo-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .sidebar-promo-content {
          padding: 16px;
          text-align: center;
          background: linear-gradient(to top, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0.2));
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
        .promo-tag {
          display: inline-block;
          background: #ff0055;
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .promo-code-box {
          background: rgba(0, 0, 0, 0.5);
          border: 1px dashed #00dcff;
          padding: 8px;
          border-radius: 6px;
          margin-top: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .promo-code-box:hover {
          background: rgba(0, 220, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 220, 255, 0.3);
        }
        .promo-code-text {
          font-family: monospace;
          color: #00dcff;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .promo-desc {
          color: #a1a1aa;
          font-size: 13px;
          margin-top: 4px;
        }
      `}</style>
      
      <motion.div 
        className="sidebar-promo-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img 
          src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80" 
          alt="Cyberpunk Promo" 
          className="sidebar-promo-img"
          style={{ minHeight: '300px', objectFit: 'cover' }}
        />
        <div className="sidebar-promo-content">
          <div className="promo-tag">Flash Sale</div>
          <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>
            GEAR GAMING ĐỈNH CAO
          </h3>
          <p className="promo-desc">Giảm ngay 20% cho đơn hàng từ 2 Triệu</p>
          
          <div className="promo-code-box" onClick={() => alert('Đã copy mã: EZ4GEAR20')}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Nhập mã khi thanh toán</div>
            <div className="promo-code-text">EZ4GEAR20</div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
