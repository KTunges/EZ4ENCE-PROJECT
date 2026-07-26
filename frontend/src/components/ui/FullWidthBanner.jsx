import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FullWidthBanner({ position, fallbackImage, fallbackTitle, fallbackDesc, height = "400px" }) {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy banner động theo position
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketing/banners`)
      .then(res => res.json())
      .then(data => {
        const matchingBanner = data.find(b => b.position === position && b.is_active);
        if (matchingBanner) {
          setBanner(matchingBanner);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [position]);

  if (loading) {
    return (
      <section style={{ 
        width: '100%', height, marginBottom: '100px', marginTop: '40px', 
        background: 'var(--surface)', borderRadius: '16px', animation: 'pulse 2s infinite' 
      }} />
    );
  }

  const bgImage = banner?.image_url || fallbackImage;
  const title = banner?.title || fallbackTitle;
  const desc = banner?.description || fallbackDesc;
  const link = banner?.link_url || "#";

  return (
    <section className="full-width-banner" style={{ 
      width: '100%', 
      height: height, 
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '40px'
    }}>
      {/* Parallax Background - Removed backgroundAttachment: fixed to fix lag */}
      <div 
        className="banner-bg" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <div className="container relative z-10" style={{ zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
        <div>
          {title && (
            <h2 className="glitch-text" data-text={title} style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {title}
            </h2>
          )}
          
          {desc && (
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6'
            }}>
              {desc}
            </p>
          )}

          {link !== "#" && (
            <a href={link} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
              Khám Phá Ngay
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
