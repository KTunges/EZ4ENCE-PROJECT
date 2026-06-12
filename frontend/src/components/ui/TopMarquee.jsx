import { useEffect, useRef } from 'react';

export default function TopMarquee() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    // Tự động sao chép nội dung để scroll mượt không bị đứt quãng
    if (marqueeRef.current) {
      const content = marqueeRef.current.innerHTML;
      marqueeRef.current.innerHTML = content + content + content;
    }
  }, []);

  return (
    <>
      <style>{`
        .top-marquee-container {
          background: #ff0055;
          color: #ffffff;
          padding: 8px 0;
          overflow: hidden;
          position: sticky;
          top: 72px;
          z-index: 900;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 0, 85, 0.5);
          box-shadow: 0 2px 10px rgba(255, 0, 85, 0.2);
        }
        .top-marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee-scroll 45s linear infinite;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .marquee-item {
          display: inline-block;
          margin-right: 40px;
        }
        .marquee-icon {
          display: inline-block;
          margin-right: 8px;
          color: #ffff00;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
      <div className="top-marquee-container">
        <div className="top-marquee-content" ref={marqueeRef}>
          <span className="marquee-item">
            <span className="marquee-icon">🔥</span> FLASH SALE GIẢM GIÁ 50% TOÀN BỘ GAMING GEAR
          </span>
          <span className="marquee-item">
            <span className="marquee-icon">⚡</span> FREESHIP ĐƠN HÀNG TỪ 2 TRIỆU ĐỒNG
          </span>
          <span className="marquee-item">
            <span className="marquee-icon">🎁</span> TẶNG KÈM CHUỘT LOGITECH KHI MUA LAPTOP GAMING
          </span>
          <span className="marquee-item">
            <span className="marquee-icon">💎</span> NHẬP MÃ "EZ4ENCE20" GIẢM NGAY 20%
          </span>
        </div>
      </div>
    </>
  );
}
