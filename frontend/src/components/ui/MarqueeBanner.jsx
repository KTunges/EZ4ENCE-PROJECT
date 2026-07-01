export default function MarqueeBanner() {
  const items = [
    "NEXT GEN GAMING", "//", "HIGH PERFORMANCE", "//", 
    "CYBER ENHANCED", "//", "CUSTOM PC BUILD", "//", 
    "PREMIUM GEAR", "//",
  ];

  return (
    <div className="marquee-container">
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track-css {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marqueeScroll 20s linear infinite;
        }
        .marquee-track-css span {
          white-space: nowrap;
          padding: 0 20px;
        }
      `}</style>
      <div className="marquee-track-css">
        {/* Render the items 4 times to ensure seamless infinite loop */}
        {[...items, ...items, ...items, ...items].map((text, index) => (
          <span key={index} className={text === '//' ? 'marquee-separator' : 'marquee-text'}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
