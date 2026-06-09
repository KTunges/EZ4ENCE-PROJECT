import { useState, useEffect, useCallback } from 'react';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

export function useHackerText(originalText, trigger = false, speed = 30) {
  const [displayText, setDisplayText] = useState(originalText);
  
  const animate = useCallback(() => {
    let iteration = 0;
    let interval = setInterval(() => {
      setDisplayText(() => {
        return originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            // Preserve spaces
            if (originalText[index] === " ") return " ";
            
            return LETTERS[Math.floor(Math.random() * LETTERS.length)];
          })
          .join("");
      });
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3; // Controls how many iterations per letter
    }, speed);
    
    return () => clearInterval(interval);
  }, [originalText, speed]);

  useEffect(() => {
    if (trigger) {
      animate();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayText(originalText);
    }
  }, [trigger, animate, originalText]);

  return displayText;
}
