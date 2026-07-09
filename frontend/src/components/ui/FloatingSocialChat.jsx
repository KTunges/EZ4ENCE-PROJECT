import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

/**
 * FloatingSocialChat — Nút liên hệ nổi (Messenger + Zalo + Hotline).
 * Hiển thị ở góc phải dưới màn hình, bên trên LiveChatWidget.
 */
export default function FloatingSocialChat() {
  const [isOpen, setIsOpen] = useState(false);

  // ============================================
  // CẤU HÌNH — Sếp thay thông tin thật ở đây
  // ============================================
  const FACEBOOK_PAGE_ID = '61592023011597'; // Facebook Page ID của EZ4GEAR
  const ZALO_PHONE = '0353835576';          // Số Zalo của shop
  const HOTLINE = '0353835576';             // Hotline

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
      icon: (
        <svg viewBox="0 0 48 48" width="24" height="24" fill="white">
          <path d="M24 4C12.95 4 4 12.95 4 24c0 6.1 2.74 11.56 7.05 15.22L9.1 44l5.08-2.77A19.8 19.8 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm9.97 26.56c-.4.9-2.34 1.74-3.23 1.8-.87.06-1.68.42-5.65-1.18-4.77-1.92-7.78-6.8-8.02-7.12-.23-.32-1.88-2.5-1.88-4.77s1.19-3.39 1.62-3.85c.43-.46.93-.57 1.24-.57h.9c.29 0 .67-.11 1.04.79.4.93 1.35 3.3 1.47 3.54.12.24.2.53.04.85-.16.32-.24.53-.47.81-.24.28-.5.63-.71.85-.24.24-.48.5-.21.98.28.48 1.24 2.04 2.66 3.31 1.82 1.63 3.36 2.13 3.84 2.37.48.24.76.2 1.04-.12.28-.32 1.2-1.4 1.52-1.88.32-.48.64-.4 1.08-.24.44.16 2.8 1.32 3.28 1.56.48.24.8.36.92.56.12.2.12 1.16-.28 2.06z" />
        </svg>
      ),
      color: '#0068FF',
      url: `https://zalo.me/${ZALO_PHONE}`,
      desc: 'Chat qua Zalo',
    },
    {
      name: 'Hotline',
      icon: <Phone size={24} color="white" />,
      color: '#22c55e',
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
              onClick={() => setIsOpen(false)}
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
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Liên hệ"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
