import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Paperclip, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = VITE_API_URL.replace('http', 'ws');

export default function LiveChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Real-time UX states
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [adminStatus, setAdminStatus] = useState('offline'); // online | offline
  const [lastMessageRead, setLastMessageRead] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(new Audio('/ting.mp3')); // Make sure to put ting.mp3 in public folder
  const fileInputRef = useRef(null);

  const getClientId = () => {
    if (user?.id) return String(user.id);
    let guestId = localStorage.getItem('ez4_guest_chat_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ez4_guest_chat_id', guestId);
    }
    return guestId;
  };

  const clientId = getClientId();

  useEffect(() => {
    let socket = null;

    if (isOpen) {
      // Khi mở, reset unread
      setUnreadCount(0);

      fetch(`${VITE_API_URL}/api/chat/sessions/${clientId}/messages`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch(err => console.error("Failed to fetch chat history:", err));

      socket = new WebSocket(`${WS_URL}/api/chat/ws/${clientId}`);
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        
        if (msg.type === "message") {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          
          if (msg.sender === "admin" || msg.sender === "ai") {
            setIsAdminTyping(false);
            setIsAiTyping(false); // dừng typing indicator của AI
            // Send read receipt back if chat is open
            socket.send(JSON.stringify({ type: "read" }));
            
            // Play sound if supported
            audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
          }
          
          setLastMessageRead(false);
        } 
        else if (msg.type === "typing" && msg.sender === "admin") {
          setIsAdminTyping(true);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsAdminTyping(false), 3000);
        }
        else if (msg.type === "read" && msg.sender === "admin") {
          setLastMessageRead(true);
        }
        else if (msg.type === "status" && msg.sender === "admin") {
          setAdminStatus(msg.status);
        }
      };
      
      socket.onclose = () => {
        setWs(prev => prev === socket ? null : prev);
      };
      setWs(socket);
    }

    return () => {
      if (socket) socket.close();
    };
  }, [isOpen, clientId]);
  
  useEffect(() => {
    // Nếu widget đóng, mở socket ẩn để nhận unread badge
    let bgSocket = null;
    if (!isOpen) {
       bgSocket = new WebSocket(`${WS_URL}/api/chat/ws/${clientId}`);
       bgSocket.onmessage = (event) => {
         const msg = JSON.parse(event.data);
         if (msg.type === "message" && msg.sender === "admin") {
           setUnreadCount(prev => prev + 1);
           audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
         }
         else if (msg.type === "status" && msg.sender === "admin") {
           setAdminStatus(msg.status);
         }
       };
    }
    return () => {
      if (bgSocket) bgSocket.close();
    }
  }, [isOpen, clientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isAdminTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !ws) return;
    
    ws.send(JSON.stringify({
      type: "message",
      content: input.trim()
    }));
    setInput('');
    
    // Nếu admin offline, hiển thị AI typing indicator
    if (adminStatus === 'offline') {
      setIsAiTyping(true);
      // Tự động tắt sau 10s (fallback)
      setTimeout(() => setIsAiTyping(false), 10000);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (ws) {
      ws.send(JSON.stringify({ type: "typing" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !ws) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${VITE_API_URL}/api/chat/upload-image`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.image_url) {
        ws.send(JSON.stringify({
          type: "message",
          image_url: data.image_url,
          content: ''
        }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'relative', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
            color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white',
              width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-page)'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      )}

      {isOpen && (
        <div style={{
          width: '350px', height: '500px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px', background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>EZ4GEAR Support</span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9, marginTop: '2px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: adminStatus === 'online' ? '#4ade80' : '#94a3b8' }}></div>
                {adminStatus === 'online' ? 'Đang hoạt động' : 'Tạm vắng'}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-dark)' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Bắt đầu trò chuyện với chúng tôi
            </div>
            
            {/* Auto Greeting */}
            {messages.length === 0 && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.4',
                  background: 'var(--bg-page)', color: 'var(--text)', borderBottomLeftRadius: '4px'
                }}>
                  Chào bạn! Bạn cần tư vấn về sản phẩm nào của EZ4GEAR ạ?
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => {
              const isCustomer = msg.sender === 'customer';
              const isAi = msg.sender === 'ai';
              const isLastCustomerMessage = isCustomer && idx === messages.map(m => m.sender).lastIndexOf('customer');

              return (
                <div key={idx} style={{ alignSelf: isCustomer ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  {/* AI Avatar */}
                  {isAi && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Bot size={12} color="white" />
                      </div>
                      <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: '600', letterSpacing: '0.3px' }}>
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.4',
                    background: isCustomer
                      ? 'var(--cyan)'
                      : isAi
                        ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))'
                        : 'var(--bg-page)',
                    color: isCustomer ? '#fff' : 'var(--text)',
                    border: isAi ? '1px solid rgba(168,85,247,0.4)' : 'none',
                    borderBottomRightRadius: isCustomer ? '4px' : '16px',
                    borderBottomLeftRadius: !isCustomer ? '4px' : '16px',
                  }}>
                    {msg.image_url && (
                      <div style={{ marginBottom: msg.content ? '6px' : '0' }}>
                        <img src={msg.image_url} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                      </div>
                    )}
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: isCustomer ? 'right' : 'left' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isAi && <span style={{ marginLeft: '4px', color: '#a855f7' }}>• AI</span>}
                  </div>
                  {isLastCustomerMessage && lastMessageRead && (
                    <div style={{ fontSize: '10px', color: 'var(--cyan)', marginTop: '2px', textAlign: 'right' }}>
                      Đã xem
                    </div>
                  )}
                </div>
              );
            })}
            
            {isAdminTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-page)', padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px' }}>
                <span className="typing-dots">...</span>
              </div>
            )}
            
            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Bot size={12} color="white" />
                  </div>
                  <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: '600' }}>AI Assistant</span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))',
                  border: '1px solid rgba(168,85,247,0.4)',
                  padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px',
                  display: 'flex', gap: '4px', alignItems: 'center'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', animation: 'pulse 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', animation: 'pulse 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: uploading ? 'wait' : 'pointer' }}
            >
              <Paperclip size={18} />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder={uploading ? "Đang tải ảnh..." : "Nhập tin nhắn..."} 
              disabled={uploading}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '20px', border: '1px solid var(--border)',
                background: 'var(--bg-page)', color: 'var(--text)', outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={!input.trim() && !uploading}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', background: input.trim() ? 'var(--cyan)' : 'var(--bg-page)',
                color: input.trim() ? '#000' : 'var(--text-muted)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
