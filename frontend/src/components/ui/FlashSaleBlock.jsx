import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { mapProduct } from '../../utils/productMapper';

export default function FlashSaleBlock() {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/flash-sales/active`);
        if (!res.ok) throw new Error("Failed to fetch flash sales");
        const data = await res.json();
        setFlashSales(data);
      } catch (error) {
        console.error("Lỗi khi tải Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSales();
  }, []);

  // Timer logic
  useEffect(() => {
    if (flashSales.length === 0) return;
    const activeSale = flashSales[0];

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(activeSale.start_time).getTime();
      const end = new Date(activeSale.end_time).getTime();

      let distance;
      let status;

      if (now < start) {
        distance = start - now;
        status = 'upcoming';
      } else {
        distance = end - now;
        status = 'active';
      }

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ status: 'ended', days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        status,
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSales]);

  if (loading) {
    return (
      <div className="flash-sale-container" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (flashSales.length === 0) return null;

  const activeSale = flashSales[0];
  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="flash-sale-container" style={{
      marginBottom: '32px',
      background: 'linear-gradient(135deg, #111 0%, #2a0808 100%)',
      borderRadius: '20px',
      padding: '24px 28px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 60, 60, 0.2)',
      boxShadow: '0 10px 40px -10px rgba(220, 38, 38, 0.4)'
    }}>
      {/* Glow effects */}
      <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,193,7,0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        gap: '20px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Flame size={36} color="#ffeb3b" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 235, 59, 0.5))' }} />
            </motion.div>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(20px, 4vw, 32px)',
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: '1.5px',
              background: 'linear-gradient(to right, #ffeb3b, #ff9800)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(255,152,0,0.3)',
              whiteSpace: 'nowrap'
            }}>
              {activeSale.name}
            </h2>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2vw, 14px)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '48px', whiteSpace: 'nowrap' }}>
            <Clock size={14} />
            {formatDateTime(activeSale.start_time)} - {formatDateTime(activeSale.end_time)}
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0
        }}>
          <span style={{
            fontSize: '15px',
            fontWeight: '700',
            color: timeLeft.status === 'upcoming' ? '#4ade80' : '#ffeb3b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center'
          }}>
            {timeLeft.status === 'upcoming' ? 'BẮT ĐẦU SAU' : 'KẾT THÚC SAU'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {timeLeft.days > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '22px',
                  minWidth: '50px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>Ngày</span>
              </div>
            )}
            {['hours', 'minutes', 'seconds'].map((unit, idx) => (
              <div key={unit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '22px',
                  minWidth: '50px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {String(timeLeft[unit] || 0).padStart(2, '0')}
                </div>
                {idx < 2 && <span style={{ fontSize: '24px', fontWeight: '900', color: 'rgba(239,68,68,0.8)' }}>:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Slider */}
      <div style={{ position: 'relative', margin: '0 -8px', padding: '0 8px' }}>
        {/* Navigation Buttons */}
        <AnimatePresence>
          {showLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollLeft}
              className="slider-arrow"
              style={{ position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'var(--text)' }}
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollRight}
              className="slider-arrow"
              style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'var(--text)' }}
            >
              <ChevronRight size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE 10+
          }}
          className="hide-scrollbar"
        >
          <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
          {activeSale.items.map((item, index) => {
            if (!item.sku || !item.sku.product) return null;

            // Ghi đè giá flash sale vào sản phẩm và format lại qua mapProduct
            const flashProduct = mapProduct({
              ...item.sku.product,
              skus: [{
                ...item.sku,
                price: item.sku.price,
                promotional_price: item.flash_price
              }]
            });

            const progress = Math.min(100, Math.round((item.sold / item.quantity) * 100));
            const isSoldOut = item.sold >= item.quantity;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  flex: '0 0 190px',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ flex: 1, padding: '8px' }}>
                  <ProductCard product={flashProduct} index={index} compact={true} />
                </div>

                {/* Progress Bar Shopee Style */}
                <div style={{ padding: '0 10px 10px 10px', marginTop: 'auto' }}>
                  <div style={{
                    width: '100%',
                    height: '22px',
                    background: isSoldOut ? '#e0e0e0' : '#ffcdd2',
                    borderRadius: '12px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0, top: 0, bottom: 0,
                      width: `${progress}%`,
                      background: isSoldOut ? '#9e9e9e' : 'linear-gradient(90deg, #ff6b6b, #ef4444)',
                      borderRadius: '12px',
                      transition: 'width 0.5s ease',
                      zIndex: 0
                    }} />
                    <span style={{
                      position: 'relative',
                      zIndex: 1,
                      fontSize: '11px',
                      fontWeight: '800',
                      color: (progress > 50 || isSoldOut) ? '#fff' : '#c62828',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {isSoldOut ? 'HẾT HÀNG' : (
                        <>
                          <Flame size={12} fill="currentColor" /> ĐÃ BÁN {item.sold}/{item.quantity}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
