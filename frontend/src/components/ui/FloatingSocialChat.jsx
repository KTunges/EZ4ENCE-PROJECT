import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

/**
 * FloatingSocialChat — Nút liên hệ nổi (Messenger + Zalo + Hotline).
 * Hiển thị ở góc phải dưới màn hình, bên trên LiveChatWidget.
 */
export default function FloatingSocialChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);
    window.addEventListener('liveChatOpened', handleHide);
    window.addEventListener('liveChatClosed', handleShow);
    return () => {
      window.removeEventListener('liveChatOpened', handleHide);
      window.removeEventListener('liveChatClosed', handleShow);
    };
  }, []);

  const toggleOpen = (state) => {
    setIsOpen(state);
    if (state) {
      window.dispatchEvent(new Event('socialChatOpened'));
    } else {
      window.dispatchEvent(new Event('socialChatClosed'));
    }
  };
  if (isHidden) return null;

  // ============================================
  // CẤU HÌNH — Sếp thay thông tin thật ở đây
  // ============================================
  const FACEBOOK_PAGE_ID = '61592023011597';
  const ZALO_PHONE = '0353835576';
  const HOTLINE = '0353835576';

  const channels = [
    {
      name: 'Messenger',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18.16.14.26.34.27.55l.05 1.74c.02.57.6.94 1.12.71l1.94-.86c.16-.07.34-.09.51-.05.89.25 1.85.38 2.85.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.85 7.55l-2.85 4.52a1.5 1.5 0 01-2.17.4l-2.27-1.7a.6.6 0 00-.72 0l-3.06 2.32c-.41.31-.94-.18-.67-.62l2.85-4.52a1.5 1.5 0 012.17-.4l2.27 1.7a.6.6 0 00.72 0l3.06-2.32c.41-.31.94.18.67.62z" />
        </svg>
      ),
      color: '#0099FF',
      url: `https://m.me/${FACEBOOK_PAGE_ID}`,
      desc: 'Chat qua Messenger',
    },
    {
      name: 'Zalo',
      icon: <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial' }}>Zalo</div>,
      color: '#0068FF',
      url: `https://zalo.me/${ZALO_PHONE}`,
      desc: 'Chat qua Zalo',
    },
    {
      name: 'Hotline',
      icon: <Phone size={20} color="white" />,
      color: '#00B14F',
      url: `tel:${HOTLINE}`,
      desc: HOTLINE,
    },
  ];

  return (
    <div className="floating-social-chat">
      {/* Expanded menu */}
      {isOpen && (
        <div className="social-chat-menu">
          <div className="social-chat-header">
            <span>💬 Liên hệ với chúng tôi</span>
          </div>
          {channels.map((ch) => (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-chat-item"
              onClick={() => toggleOpen(false)}
            >
              <span className="social-chat-icon" style={{ background: ch.color }}>{ch.icon}</span>
              <div className="social-chat-info">
                <strong>{ch.name}</strong>
                <span>{ch.desc}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Floating button */}
      <button
        className={`social-chat-fab ${isOpen ? 'active' : ''}`}
        onClick={() => toggleOpen(!isOpen)}
        aria-label="Liên hệ"
      >
        {isOpen ? <X size={26} /> : (
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            {/* Zalo (Top Left) */}
            <div style={{ position: 'absolute', top: 0, left: '-4px', background: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            </div>
            
            {/* Messenger (Top Right) */}
            <div style={{ position: 'absolute', top: 0, right: '-4px', background: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" alt="FB" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
            </div>
            
            {/* Phone (Bottom Center) */}
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: '#00B14F', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
              <Phone size={12} color="white" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
