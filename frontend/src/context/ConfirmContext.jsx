import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { registerPopup } from '../utils/popup';
import { useToast } from './ToastContext';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const { addToast } = useToast();

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  // Đăng ký global popups khi mount
  React.useEffect(() => {
    registerPopup(addToast, showConfirm);
  }, [addToast, showConfirm]);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="confirm-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="confirm-modal glass-panel"
              style={{
                width: '90%', maxWidth: '400px', padding: '24px',
                borderRadius: '12px', background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 40px rgba(0, 212, 255, 0.15)',
                display: 'flex', flexDirection: 'column', gap: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 42, 109, 0.1)', borderRadius: '50%', color: 'var(--pink)' }}>
                  <AlertTriangle size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: 'var(--text-color)' }}>Xác nhận</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {confirmState.message}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button 
                  onClick={confirmState.onCancel}
                  style={{
                    padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--text-color)', cursor: 'pointer',
                    fontWeight: 500, transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'var(--bg-hover)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmState.onConfirm}
                  style={{
                    padding: '10px 16px', borderRadius: '6px', border: 'none',
                    background: 'var(--pink)', color: '#fff', cursor: 'pointer',
                    fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255, 42, 109, 0.3)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.target.style.transform = 'none'}
                >
                  Đồng ý
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
