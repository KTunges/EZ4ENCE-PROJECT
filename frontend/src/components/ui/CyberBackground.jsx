import { useState } from 'react';

export default function CyberBackground() {
  const [particles] = useState(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  })));

  return (
    <div className="cyber-background">
      <div className="cyber-grid-overlay"></div>
      
      {/* Pure CSS Particles for performance instead of framer-motion */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="cyber-particle"
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: 'var(--cyan)',
            borderRadius: '50%',
            animation: `floatParticle ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
      <div className="cyber-glitch-line line-1"></div>
      <div className="cyber-glitch-line line-2"></div>
      <div className="cyber-glitch-line line-3"></div>
    </div>
  );
}
