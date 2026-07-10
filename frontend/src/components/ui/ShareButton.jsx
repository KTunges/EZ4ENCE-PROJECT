import { useState, useRef, useEffect } from 'react';
import { Share2, X, Link2, Check, Mail, MessageCircle } from 'lucide-react';

/**
 * ShareButton — Nút chia sẻ sản phẩm qua mạng xã hội.
 * Props: productName, productUrl (optional, defaults to current URL)
 */
export default function ShareButton({ productName, productUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  const url = productUrl || window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(productName || document.title);

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
      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>,
      color: '#1877F2',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400'),
    },
    {
      name: 'Messenger',
      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18.16.14.26.34.27.55l.05 1.74c.02.57.6.94 1.12.71l1.94-.86c.16-.07.34-.09.51-.05.89.25 1.85.38 2.85.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.85 7.55l-2.85 4.52a1.5 1.5 0 01-2.17.4l-2.27-1.7a.6.6 0 00-.72 0l-3.06 2.32c-.41.31-.94-.18-.67-.62l2.85-4.52a1.5 1.5 0 012.17-.4l2.27 1.7a.6.6 0 00.72 0l3.06-2.32c.41-.31.94.18.67.62z"/></svg>,
      color: '#0099FF',
      action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=${import.meta.env.VITE_FACEBOOK_APP_ID || '1706350950812679'}&redirect_uri=${encodedUrl}`, '_blank', 'width=600,height=400'),
    },
    {
      name: 'Zalo',
      icon: <MessageCircle size={18} />,
      color: '#0068FF',
      action: () => window.open(`https://zalo.me/share?url=${encodedUrl}`, '_blank', 'width=600,height=600'),
    },
    {
      name: 'Instagram',
      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
      color: '#E1306C',
      action: () => {
        navigator.clipboard.writeText(url);
        alert('Đã sao chép link! Mở Instagram để dán vào tin nhắn hoặc story của bạn.');
        window.open('https://www.instagram.com/', '_blank');
      },
    },
    {
      name: 'X (Twitter)',
      icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      color: 'var(--text)',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank', 'width=600,height=400'),
    },
    {
      name: 'Email',
      icon: <Mail size={18} />,
      color: '#EA4335',
      action: () => window.open(`mailto:?subject=${encodedTitle}&body=Xem sản phẩm tại: ${url}`, '_self'),
    },
    {
      name: 'Sao chép link',
      icon: copied ? <Check size={18} /> : <Link2 size={18} />,
      color: copied ? '#22c55e' : 'var(--cyan)',
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const handleShareClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="share-button-wrapper" ref={menuRef} style={{ position: 'relative' }}>
      <button
        className="btn-share-toggle"
        onClick={handleShareClick}
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
                if (opt.name !== 'Sao chép link') setIsOpen(false);
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
