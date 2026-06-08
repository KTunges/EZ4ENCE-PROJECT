import { motion } from 'framer-motion';

export default function MarqueeBanner() {
  const items = [
    "NEXT GEN GAMING",
    "//",
    "HIGH PERFORMANCE",
    "//",
    "CYBER ENHANCED",
    "//",
    "CUSTOM PC BUILD",
    "//",
    "PREMIUM GEAR",
    "//",
  ];

  return (
    <div className="marquee-container">
      <motion.div
        className="marquee-track"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {/* Render the items twice to create an infinite loop effect */}
        {[...items, ...items, ...items].map((text, index) => (
          <span key={index} className={text === '//' ? 'marquee-separator' : 'marquee-text'}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
