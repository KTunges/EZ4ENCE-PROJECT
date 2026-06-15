import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, User } from 'lucide-react';
import CyberBackground from '../../components/ui/CyberBackground';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, updateProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Name Prompt state
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await loginWithGoogle(tokenResponse.access_token);
      if (data.is_new_user) {
        setShowNamePrompt(true);
      } else if (data.user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Đăng nhập Google thất bại.')
  });

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      setIsLoading(true);
      await updateProfile(displayName);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <CyberBackground />

      <div className="auth-container">
        {/* Left — Branding Panel */}
        <motion.div
          className="auth-branding"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="auth-branding-inner">
            <Link to="/" className="auth-logo glitch-text" data-text="EZ4ENCE">EZ4ENCE</Link>
            <h2 className="auth-branding-title">Chào Mừng Trở Lại</h2>
            <p className="auth-branding-desc">
              Đăng nhập để truy cập vào hệ thống linh kiện, gaming gear và custom PC hàng đầu Việt Nam.
            </p>
            <div className="auth-branding-stats">
              <div><span>10K+</span><p>Sản phẩm</p></div>
              <div><span>50K+</span><p>Khách hàng</p></div>
              <div><span>99.8%</span><p>Hài lòng</p></div>
            </div>
          </div>
        </motion.div>

        {/* Right — Login Form */}
        <motion.div
          className="auth-form-panel"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="auth-form-inner">
            <div className="auth-form-header">
              <span className="section-tag">// AUTHENTICATION</span>
              <h1 className="auth-form-title glitch-text" data-text="ĐĂNG NHẬP">ĐĂNG NHẬP</h1>
              <p className="auth-form-subtitle">Nhập thông tin tài khoản để tiếp tục</p>
            </div>

            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className="auth-field">
                <label htmlFor="login-email">Email</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-field-header">
                  <label htmlFor="login-password">Mật khẩu</label>
                  <Link to="/forgot-password" className="auth-forgot-link">Quên mật khẩu?</Link>
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-pass"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="auth-spinner" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Đăng Nhập</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {showNamePrompt && (
                <motion.div 
                  className="auth-name-prompt"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="auth-divider">
                    <span>HOÀN TẤT HỒ SƠ</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                    Chào bạn mới! Vui lòng đặt tên hiển thị cho tài khoản của bạn.
                  </p>
                  <form onSubmit={handleNameSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>Tên hiển thị</label>
                        <div className="auth-input-wrapper">
                        <User size={18} className="auth-input-icon" />
                        <input type="text" placeholder="Nguyễn Văn A" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || !displayName.trim()}>
                        {isLoading ? <div className="auth-spinner" /> : <><ArrowRight size={18} /><span>Cập Nhật & Vào Trang Chủ</span></>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="auth-divider">
              <span>HOẶC TIẾP TỤC VỚI</span>
            </div>

            {/* Social Login */}
            {!showNamePrompt && (
              <div className="auth-social">
                <button type="button" className="auth-social-btn google" onClick={() => googleLogin()}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>
              <button type="button" className="auth-social-btn facebook" onClick={() => alert('Facebook OAuth - Coming Soon')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
            )}

            {/* Register Link */}
            <p className="auth-switch">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="auth-switch-link">Đăng ký ngay <ArrowRight size={14} /></Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
