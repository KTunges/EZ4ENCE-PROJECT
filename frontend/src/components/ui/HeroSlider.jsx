import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSlider() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/marketing/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(data.filter(b => b.position === 'hero_slider' && b.is_active));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="container relative z-10" style={{ marginTop: '20px', marginBottom: '40px' }}>
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '21/9', 
          overflow: 'hidden', 
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,220,255,0.1)'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {banners[currentIndex].link_url ? (
              <Link to={banners[currentIndex].link_url} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img 
                  src={banners[currentIndex].image_url} 
                  alt={banners[currentIndex].title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Link>
            ) : (
              <img 
                src={banners[currentIndex].image_url} 
                alt={banners[currentIndex].title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              style={{
                position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                zIndex: 2, backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              style={{
                position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                zIndex: 2, backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
              {banners.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: idx === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentIndex ? 'var(--cyan)' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
