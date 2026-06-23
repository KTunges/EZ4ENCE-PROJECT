import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, Clock, ToggleLeft, ToggleRight, Paperclip, CheckCircle } from 'lucide-react';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = VITE_API_URL.replace('http', 'ws');

export default function AdminChat() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Real-time states
  const [typingStatus, setTypingStatus] = useState({});
  const [readStatus, setReadStatus] = useState({});
  const [adminStatus, setAdminStatus] = useState(() => {
    return localStorage.getItem('ez4_admin_status') || 'online';
  });

  const messagesEndRef = useRef(null);
  const typingTimeouts = useRef({});
  const audioRef = useRef(new Audio('/ting.mp3'));
  const fileInputRef = useRef(null);

  const cannedResponses = [
    "Chào bạn, EZ4GEAR có thể giúp gì cho bạn?",
    "Sản phẩm này hiện đang còn hàng bạn nhé.",
    "Bạn vui lòng cung cấp mã đơn hàng để mình kiểm tra.",
    "Cảm ơn bạn đã liên hệ EZ4GEAR!"
  ];

  const wsRef = useRef(null);

  useEffect(() => {
    fetchSessions();

    const socket = new WebSocket(`${WS_URL}/api/chat/ws/admin/connect`);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "status", status: adminStatus }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.type === "message") {
        setSessions(prev => {
          let exists = prev.find(s => s.client_id === msg.client_id);
          let updatedSessions;
          if (exists) {
            updatedSessions = prev.map(s => 
              s.client_id === msg.client_id 
                ? { ...s, last_message: msg.content || '[Hình ảnh]', last_message_time: msg.created_at, customer_name: msg.customer_name || s.customer_name, unread_count: msg.sender === 'customer' ? (s.unread_count || 0) + 1 : 0 }
                : s
            );
          } else {
            fetchSessions();
            return prev;
          }
          return updatedSessions.sort((a, b) => new Date(b.last_message_time || 0) - new Date(a.last_message_time || 0));
        });

        setSelectedSession(current => {
          if (current && current.client_id === msg.client_id) {
            setMessages(prev => {
              if (prev.find(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            setTypingStatus(prev => ({ ...prev, [msg.client_id]: false }));
            setReadStatus(prev => ({ ...prev, [msg.client_id]: false }));
            
            if (msg.sender === "customer") {
               socket.send(JSON.stringify({ type: "read", client_id: msg.client_id }));
            }
            
            // Nếu đang mở session này thì reset unread
            setSessions(sessionsPrev => sessionsPrev.map(s => s.client_id === current.client_id ? { ...s, unread_count: 0 } : s));
          }
          return current;
        });

        if (msg.sender === "customer") {
          audioRef.current.play().catch(e => console.log('Audio error:', e));
        }

      } else if (msg.type === "typing" && msg.client_id) {
        setTypingStatus(prev => ({ ...prev, [msg.client_id]: true }));
        clearTimeout(typingTimeouts.current[msg.client_id]);
        typingTimeouts.current[msg.client_id] = setTimeout(() => {
          setTypingStatus(prev => ({ ...prev, [msg.client_id]: false }));
        }, 3000);
      } else if (msg.type === "read" && msg.client_id) {
        setReadStatus(prev => ({ ...prev, [msg.client_id]: true }));
      }
    };
    
    socket.onclose = () => {
      if (wsRef.current === socket) {
        setWs(null);
        wsRef.current = null;
      }
    };
    setWs(socket);
    wsRef.current = socket;

    return () => {
      if (socket) socket.close();
    };
  }, []); // Run ONCE on mount



  const fetchSessions = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/chat/sessions`);
      const data = await res.json();
      setSessions(data.filter(s => s.is_active)); // Only show active sessions
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  const selectSession = async (session) => {
    setSelectedSession(session);
    try {
      const res = await fetch(`${VITE_API_URL}/api/chat/sessions/${session.client_id}/messages`);
      const data = await res.json();
      setMessages(data);
      
      setSessions(prev => prev.map(s => s.client_id === session.client_id ? { ...s, unread_count: 0 } : s));
      
      if (ws) {
        ws.send(JSON.stringify({ type: "read", client_id: session.client_id }));
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedSession, typingStatus]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !ws || !selectedSession) return;

    ws.send(JSON.stringify({
      type: "message",
      client_id: selectedSession.client_id,
      content: input.trim()
    }));
    
    setInput('');
  };

  const handleSendCanned = (text) => {
    if (!wsRef.current || !selectedSession || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "message",
      client_id: selectedSession.client_id,
      content: text
    }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (ws && selectedSession) {
      ws.send(JSON.stringify({ type: "typing", client_id: selectedSession.client_id }));
    }
  };

  const toggleAdminStatus = () => {
    const newStatus = adminStatus === 'online' ? 'offline' : 'online';
    setAdminStatus(newStatus);
    if (ws) {
      ws.send(JSON.stringify({ type: "status", status: newStatus }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedSession || !ws) return;
    
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
          client_id: selectedSession.client_id,
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

  const resolveSession = async () => {
    if (!selectedSession) return;
    if (!window.confirm("Bạn có chắc muốn kết thúc cuộc trò chuyện này?")) return;
    
    try {
      await fetch(`${VITE_API_URL}/api/chat/sessions/${selectedSession.id}/resolve`, { method: 'PUT' });
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
      setSelectedSession(null);
    } catch (err) {
      console.error("Failed to resolve session", err);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 150px)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      
      {/* Sidebar: Session List */}
      <div style={{ width: '300px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--cyan)" /> Live Chat
          </h2>
          <button 
            onClick={() => {
              const newStatus = adminStatus === 'online' ? 'offline' : 'online';
              setAdminStatus(newStatus);
              localStorage.setItem('ez4_admin_status', newStatus);
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: "status", status: newStatus }));
              }
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: adminStatus === 'online' ? '#4ade80' : 'var(--text-muted)' }}
            title={adminStatus === 'online' ? 'Đang Online' : 'Đang Offline'}
          >
            {adminStatus === 'online' ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có phiên chat nào.</div>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => selectSession(session)}
                style={{
                  padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                  background: selectedSession?.client_id === session.client_id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  borderLeft: selectedSession?.client_id === session.client_id ? '3px solid var(--cyan)' : '3px solid transparent',
                  transition: 'background 0.2s', position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {session.avatar ? (
                      <img src={session.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={18} color="rgba(255,255,255,0.8)" />
                    )}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {session.customer_name || `Khách (#${session.client_id.substring(0,6)})`}
                    </div>
                    {session.last_message_time && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {new Date(session.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {typingStatus[session.client_id] ? <span style={{color: 'var(--cyan)'}}>Đang gõ...</span> : (session.last_message || 'Bắt đầu chat...')}
                </div>
                
                {session.unread_count > 0 && selectedSession?.client_id !== session.client_id && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: 'white',
                    width: '20px', height: '20px', borderRadius: '50%', fontSize: '11px', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {session.unread_count > 9 ? '9+' : session.unread_count}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
        {selectedSession ? (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {selectedSession.avatar ? (
                    <img src={selectedSession.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={20} color="rgba(255,255,255,0.8)" />
                  )}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {selectedSession.customer_name || `Khách (#${selectedSession.client_id})`}
                </div>
              </div>
              <button 
                onClick={resolveSession}
                style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <CheckCircle size={16} color="#4ade80" /> Kết thúc Chat
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin';
                const isLastAdminMessage = isAdmin && idx === messages.map(m => m.sender).lastIndexOf('admin');

                return (
                  <div key={idx} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.5',
                      background: isAdmin ? 'var(--cyan)' : 'var(--bg-card)',
                      color: isAdmin ? '#fff' : 'var(--text)',
                      borderBottomRightRadius: isAdmin ? '4px' : '16px',
                      borderBottomLeftRadius: !isAdmin ? '4px' : '16px',
                      border: isAdmin ? 'none' : '1px solid var(--border)'
                    }}>
                      {msg.image_url && (
                        <div style={{ marginBottom: msg.content ? '8px' : '0' }}>
                          <img src={msg.image_url} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </div>
                      )}
                      {msg.content}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', textAlign: isAdmin ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {isLastAdminMessage && readStatus[selectedSession.client_id] && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', textAlign: 'right' }}>
                        Đã xem
                      </div>
                    )}
                  </div>
                );
              })}
              
              {typingStatus[selectedSession.client_id] && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border)' }}>
                  <span className="typing-dots">...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Canned Responses */}
            <div style={{ padding: '10px 20px', display: 'flex', gap: '10px', overflowX: 'auto', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              {cannedResponses.map((text, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => handleSendCanned(text)}
                  style={{ flexShrink: 0, padding: '6px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '13px', color: 'var(--text)', cursor: 'pointer' }}
                >
                  {text.length > 30 ? text.substring(0, 30) + '...' : text}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: uploading ? 'wait' : 'pointer' }}
              >
                <Paperclip size={20} />
              </button>

              <input 
                type="text" 
                value={input}
                onChange={handleInputChange}
                placeholder={uploading ? "Đang tải ảnh lên..." : "Nhập tin nhắn để trả lời khách hàng..."} 
                disabled={uploading}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: '8px', border: '1px solid var(--border)',
                  background: 'var(--bg-page)', color: 'var(--text)', outline: 'none', fontSize: '15px'
                }}
              />
              <button 
                type="submit"
                disabled={!input.trim() && !uploading}
                style={{
                  padding: '0 24px', height: '48px', borderRadius: '8px', background: input.trim() ? 'var(--cyan)' : 'var(--bg-dark)',
                  color: input.trim() ? '#000' : 'var(--text-muted)', border: '1px solid var(--border)', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold'
                }}
              >
                Gửi <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '20px' }} />
            <div style={{ fontSize: '16px' }}>Chọn một cuộc hội thoại bên trái để bắt đầu chat</div>
          </div>
        )}
      </div>
    </div>
  );
}
