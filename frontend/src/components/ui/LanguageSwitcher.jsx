import { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
];

export default function LanguageSwitcher() {
  const isLoaded = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('vi');
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'vi', 
            includedLanguages: 'vi,en,zh-CN,ko,ja,fr,de,es,ru,th', 
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      if (window.google && window.google.translate && window.googleTranslateElementInit) {
         window.googleTranslateElementInit();
      }
    }
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match && match[1]) {
      const parts = match[1].split('/');
      if (parts.length === 3 && parts[2]) {
        if (parts[2] !== 'vi') {
           setCurrentLang(parts[2]);
        }
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    const translationValue = langCode === 'vi' ? '/vi/vi' : `/vi/${langCode}`;
    document.cookie = `googtrans=${translationValue}; path=/;`;
    document.cookie = `googtrans=${translationValue}; domain=${window.location.hostname}; path=/;`;

    if (langCode === 'vi') {
      // Bắt buộc reload khi quay về tiếng mẹ đẻ để xóa sạch dịch thuật ngầm
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
      window.location.reload();
    } else {
      // Chuyển ngôn ngữ ngay lập tức mà KHÔNG CẦN TẢI LẠI TRANG
      const selectEl = document.querySelector('.goog-te-combo');
      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        window.location.reload();
      }
    }
  };

  const selectedLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      <div className="custom-lang-switcher" ref={dropdownRef} style={{ position: 'relative' }}>
        <button 
          className="lang-toggle-btn" 
          onClick={() => setIsOpen(!isOpen)}
          title="Chọn ngôn ngữ"
        >
          <Globe size={18} />
          <span className="lang-toggle-text">{selectedLang.code.toUpperCase()}</span>
          <ChevronDown size={14} className={`lang-chevron ${isOpen ? 'open' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="lang-dropdown-menu"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-label">{lang.label}</span>
                  {currentLang === lang.code && <Check size={16} className="lang-check" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ẩn widget gốc đi nhưng không dùng display: none vì có thể khiến nó không render selectEl */}
        <div id="google_translate_element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -1 }}></div>
      </div>
    </>
  );
}
