import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CyberBackground() {
  const [particles] = useState(() => Array.from({ length: 20 }).map((_, i) => ({
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
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="cyber-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
      <div className="cyber-glitch-line line-1"></div>
      <div className="cyber-glitch-line line-2"></div>
      <div className="cyber-glitch-line line-3"></div>
    </div>
  );
}
