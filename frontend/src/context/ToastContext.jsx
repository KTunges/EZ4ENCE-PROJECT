import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`toast-item toast-${toast.type} glass-panel`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderRadius: '8px',
                minWidth: '300px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                borderLeft: `4px solid ${
                  toast.type === 'success' ? 'var(--cyan)' : 
                  toast.type === 'error' ? 'var(--pink)' : 
                  'var(--text-muted)'
                }`,
                background: 'var(--bg-card)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle size={22} color="var(--cyan)" />}
                {toast.type === 'error' && <AlertCircle size={22} color="var(--pink)" />}
                {toast.type === 'info' && <Info size={22} color="var(--text-color)" />}
              </div>
              <div className="toast-content" style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--text)', fontWeight: '500' }}>{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
