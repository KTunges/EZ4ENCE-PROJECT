import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const MAIN_BANNERS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80"
];

export default function BentoBanners() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MAIN_BANNERS.length);
    }, 4000); // Đổi ảnh mỗi 4 giây
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        .bento-wrapper {
          margin-bottom: 32px;
          padding: 8px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(0, 220, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 220, 255, 0.05);
        }
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 768px) {
          .bento-wrapper {
            padding: 12px;
          }
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .bento-main {
            grid-column: span 2;
            grid-row: span 2;
          }
          .bento-side {
            height: 150px;
          }
          .bento-bottom {
            height: 120px;
          }
        }
        .bento-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #1e293b;
          display: block;
        }
        .bento-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .bento-item:hover img {
          transform: scale(1.05);
        }
        /* Cấu hình riêng cho Slider Ảnh chính */
        .banner-slider-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .banner-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        .banner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .banner-dot.active {
          background: #00dcff;
          width: 24px;
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(0, 220, 255, 0.6);
        }
        .bento-item:hover .banner-slider-img {
          transform: scale(1.05);
        }
        /* Mobile fallback height */
        @media (max-width: 767px) {
          .bento-item {
            height: 160px;
          }
        }
      `}</style>
      
      <div className="bento-wrapper">
        <div className="bento-grid">
          {/* ── MAIN BANNER (Col 1-2, Row 1-2) ── */}
          <Link to="/products?category=man-hinh" className="bento-item bento-main">
            <AnimatePresence initial={false}>
              <motion.img 
                key={currentIndex}
                src={MAIN_BANNERS[currentIndex]}
                alt={`Main Banner ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="banner-slider-img"
              />
            </AnimatePresence>
            
            {/* Nút chuyển ảnh (Dots) */}
            <div className="banner-dots">
              {MAIN_BANNERS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`banner-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex(idx);
                  }}
                />
              ))}
            </div>
          </Link>

          {/* ── SIDE BANNER 1 (Top Right) ── */}
          <Link to="/products?category=pc" className="bento-item bento-side">
            <img 
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80" 
              alt="Side Banner 1" 
            />
          </Link>

          {/* ── SIDE BANNER 2 (Middle Right) ── */}
          <Link to="/products?category=ban-phim" className="bento-item bento-side">
            <img 
              src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80" 
              alt="Side Banner 2" 
            />
          </Link>

          {/* ── BOTTOM BANNER 1 ── */}
          <Link to="/products?category=laptop" className="bento-item bento-bottom">
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80" 
              alt="Bottom Banner 1" 
            />
          </Link>

          {/* ── BOTTOM BANNER 2 ── */}
          <Link to="/products?category=laptop-office" className="bento-item bento-bottom">
            <img 
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80" 
              alt="Bottom Banner 2" 
            />
          </Link>

          {/* ── BOTTOM BANNER 3 ── */}
          <Link to="/products?category=pc-gaming" className="bento-item bento-bottom">
            <img 
              src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80" 
              alt="Bottom Banner 3" 
            />
          </Link>
        </div>
      </div>
    </>
  );
}
