import { useState, useRef, useEffect } from 'react';
import { Share2, X, Link2, Check } from 'lucide-react';

/**
 * ShareButton — Chia sẻ sản phẩm qua Facebook + Copy URL.
 */
export default function ShareButton({ productName, productSlug, productUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // URL gốc của frontend (dùng để copy)
  const frontendUrl = productUrl || window.location.href;
  
  // URL dành riêng cho Facebook Share (trỏ về backend để Facebook đọc được OG Tags: hình, tên, giá)
  // Lưu ý: Trên localhost, Facebook sẽ không đọc được. Chỉ hoạt động khi có domain thật.
  const backendApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const facebookShareUrl = productSlug 
    ? `${backendApiUrl}/api/og/product/${productSlug}` 
    : frontendUrl;

  const encodedFbUrl = encodeURIComponent(facebookShareUrl);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
      ),
      color: '#1877F2',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedFbUrl}`,
          'facebook-share',
          'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
        );
      },
    },
    {
      name: 'Messenger',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18.16.14.26.34.27.55l.05 1.74c.02.57.6.94 1.12.71l1.94-.86c.16-.07.34-.09.51-.05.89.25 1.85.38 2.85.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.85 7.55l-2.85 4.52a1.5 1.5 0 01-2.17.4l-2.27-1.7a.6.6 0 00-.72 0l-3.06 2.32c-.41.31-.94-.18-.67-.62l2.85-4.52a1.5 1.5 0 012.17-.4l2.27 1.7a.6.6 0 00.72 0l3.06-2.32c.41-.31.94.18.67.62z" />
        </svg>
      ),
      color: '#0099FF',
      action: () => {
        const appId = import.meta.env.VITE_FACEBOOK_APP_ID || '1706350950812679';
        window.open(
          `https://www.facebook.com/dialog/send?link=${encodedFbUrl}&app_id=${appId}&redirect_uri=${encodeURIComponent(frontendUrl)}`,
          'messenger-share',
          'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
        );
      },
    },
    {
      name: 'Zalo',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M21.5 10.5c0-4.7-4.2-8.5-9.5-8.5S2.5 5.8 2.5 10.5c0 2.3 1.1 4.5 3 6 .3.2.3.7.1 1.1-.3.7-.8 1.9-1.2 2.8-.2.5.3 1 1 .8 1.3-.4 3.7-1.3 4.9-1.8.2-.1.4-.1.7-.1 1 .2 2 .3 3.1.3 5.3 0 9.5-3.8 9.5-8.5v-.6h-2.1v.6z"/>
        </svg>
      ),
      color: '#0068FF',
      action: () => {
        window.open(
          `https://zalo.me/share?v=4&u=${encodedFbUrl}`,
          'zalo-share',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'var(--text)',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedFbUrl}&text=${encodeURIComponent(productName)}`,
          'twitter-share',
          'width=600,height=400'
        );
      },
    },
    {
      name: copied ? 'Đã sao chép!' : 'Sao chép URL',
      icon: copied ? <Check size={18} /> : <Link2 size={18} />,
      color: copied ? '#22c55e' : 'var(--cyan)',
      action: () => {
        // Vẫn copy URL của frontend để gửi bạn bè bấm vào xem bình thường
        navigator.clipboard.writeText(frontendUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  return (
    <div className="share-button-wrapper" ref={menuRef} style={{ position: 'relative' }}>
      <button
        className="btn-share-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chia sẻ sản phẩm"
      >
        {isOpen ? <X size={20} /> : <Share2 size={20} />}
      </button>

      {isOpen && (
        <div className="share-dropdown">
          <span className="share-dropdown-title">Chia sẻ sản phẩm</span>
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              className="share-option"
              onClick={() => {
                opt.action();
                if (!opt.name.includes('sao chép') && !opt.name.includes('Đã sao')) setIsOpen(false);
              }}
            >
              <span className="share-option-icon" style={{ color: opt.color }}>{opt.icon}</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
