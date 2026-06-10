import { useState } from 'react';

export default function ImageMagnifier({ src, alt, width = '100%', height = 'auto', magnifierHeight = 150, magnifierWidth = 150, zoomLevel = 2 }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    
    // Calculate cursor position on the image
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    setCursorPosition({ x, y });

    // Calculate position for the background image of the magnifier
    // It should center the magnified portion on the cursor
    setPosition({
      x: -x * zoomLevel + magnifierWidth / 2,
      y: -y * zoomLevel + magnifierHeight / 2
    });
  };

  return (
    <div
      style={{ position: 'relative', width, height, cursor: 'zoom-in' }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      className="magnifier-container"
    >
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="gallery-main-img" />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${cursorPosition.y - magnifierHeight / 2}px`,
            left: `${cursorPosition.x - magnifierWidth / 2}px`,
            opacity: 1,
            border: '2px solid var(--cyan)',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${100 * zoomLevel}% ${100 * zoomLevel}%`,
            backgroundPositionX: `${position.x}px`,
            backgroundPositionY: `${position.y}px`,
            boxShadow: '0 0 20px rgba(0, 220, 255, 0.5)',
            zIndex: 100
          }}
        />
      )}
    </div>
  );
}
