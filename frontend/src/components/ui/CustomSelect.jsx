import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ value, onChange, options, icon, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    (typeof opt === 'string' ? opt : opt.value) === value
  );
  
  const displayLabel = typeof selectedOption === 'string' 
    ? selectedOption 
    : (selectedOption?.label || value);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-value">
          {icon && <span className="custom-select-icon">{icon}</span>}
          <span>{displayLabel}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`custom-select-arrow ${isOpen ? 'open' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-select-dropdown glass"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="custom-select-list">
              {options.map((opt, idx) => {
                const isString = typeof opt === 'string';
                const optValue = isString ? opt : opt.value;
                const optLabel = isString ? opt : opt.label;
                const isSelected = optValue === value;

                return (
                  <li key={idx}>
                    <button
                      type="button"
                      className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(optValue)}
                    >
                      <span>{optLabel}</span>
                      {isSelected && <Check size={14} className="text-cyan" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
