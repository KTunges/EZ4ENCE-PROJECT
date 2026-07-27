import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, LogIn, UserPlus, User, X, Gamepad2, Mouse, Headphones, Cpu, Monitor, Keyboard, Crosshair, Speaker, HardDrive, Terminal, ShieldCheck, KeyRound, Fingerprint, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register, loginWithGoogle, loginWithFacebook, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'register');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Name Prompt state
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // OTP state
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [otp, setOtp] = useState('');
  const [authAction, setAuthAction] = useState('login');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(null); // null | 'email' | 'otp' | 'reset' | 'success'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState(['', '', '', '', '', '']);
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const startForgotCountdown = () => {
    setForgotCountdown(60);
    const timer = setInterval(() => {
      setForgotCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Có lỗi xảy ra');
      setForgotStep('otp');
      startForgotCountdown();
      window.toast?.success('Mã OTP đã được gửi đến email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      const newOtp = [...forgotOtp];
      digits.split('').forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setForgotOtp(newOtp);
      document.getElementById(`forgot-otp-${Math.min(index + digits.length, 5)}`)?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...forgotOtp];
    newOtp[index] = value;
    setForgotOtp(newOtp);
    if (value && index < 5) document.getElementById(`forgot-otp-${index + 1}`)?.focus();
  };

  const handleForgotOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !forgotOtp[index] && index > 0) {
      document.getElementById(`forgot-otp-${index - 1}`)?.focus();
    }
  };

  const handleForgotVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = forgotOtp.join('');
    if (otpString.length !== 6) { setError('Vui lòng nhập đủ 6 số OTP'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: otpString })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Mã OTP không chính xác');
      setForgotStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotResendOTP = async () => {
    if (forgotCountdown > 0) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.detail); }
      setForgotOtp(['', '', '', '', '', '']);
      startForgotCountdown();
      window.toast?.success('Đã gửi lại mã OTP!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    if (forgotNewPass.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (forgotNewPass !== forgotConfirmPass) { setError('Mật khẩu xác nhận không khớp'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp.join(''), new_password: forgotNewPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Có lỗi xảy ra');
      setForgotStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exitForgotPassword = () => {
    setForgotStep(null);
    setForgotEmail('');
    setForgotOtp(['', '', '', '', '', '']);
    setForgotNewPass('');
    setForgotConfirmPass('');
    setShowForgotPass(false);
    setError('');
  };

  // Handle switching on mobile where the overlay is hidden
  const [mobileMode, setMobileMode] = useState(initialMode);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSignUp(initialMode === 'register');
    setMobileMode(initialMode);
    setShowNamePrompt(false);
  }, [initialMode, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await loginWithGoogle(tokenResponse.access_token);
      if (data.is_new_user) {
        setShowNamePrompt(true);
      } else {
        onClose();
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

  const handleFacebookSuccess = async (response) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await loginWithFacebook(response.accessToken);
      if (data.is_new_user) {
        setShowNamePrompt(true);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNativeFacebookLogin = () => {
    if (!window.FB) {
      setError("Chưa tải xong Facebook SDK, vui lòng thử lại.");
      return;
    }
    window.FB.login(function(response) {
      if (response.authResponse) {
        handleFacebookSuccess(response.authResponse);
      } else {
        setError('Đăng nhập Facebook bị hủy hoặc thất bại.');
      }
    }, {scope: 'public_profile,email'});
  };

  useEffect(() => {
    if (window.FB) return;
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : import.meta.env.VITE_FACEBOOK_APP_ID || '123456789',
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0'
      });
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/vi_VN/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      setIsLoading(true);
      await updateProfile(displayName);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginUsername, loginPassword);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== regConfirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (regPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }

    setIsLoading(true);
    try {
      await register(regName, regUsername, regPassword);
      setSuccess('Đăng ký thành công! Đang đăng nhập...');
      // Auto login after register
      await login(regUsername, regPassword);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (isUp) => {
    setIsSignUp(isUp);
    setMobileMode(isUp ? 'register' : 'login');
    setError('');
    setSuccess('');
    setShowNamePrompt(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={`auth-modal-sliding-container ${isSignUp ? 'right-panel-active' : ''} mobile-${mobileMode}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="auth-modal-close" onClick={onClose} aria-label="Đóng">
              <X size={20} />
            </button>

            {/* Display Name Prompt Form */}
            <AnimatePresence>
              {showNamePrompt && (
                <motion.div 
                  className="auth-name-prompt-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="auth-form-wrapper" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px' }}>
                    <div className="auth-modal-header">
                        <span className="section-tag">// UPDATE_PROFILE</span>
                        <h2 className="auth-modal-title glitch-text" data-text="XIN CHÀO">XIN CHÀO</h2>
                        <p className="auth-form-subtitle">Đây là lần đầu bạn đăng nhập. Vui lòng đặt tên hiển thị.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleNameSubmit} className="auth-form">
                        <div className="auth-field">
                            <label>Tên hiển thị</label>
                            <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input type="text" placeholder="Nguyễn Văn A" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || !displayName.trim()}>
                            {isLoading ? <div className="auth-spinner" /> : <><ArrowRight size={18} /><span>Cập Nhật</span></>}
                        </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>



            {/* Sign Up Form */}
            <div className="auth-form-container sign-up-container">
              <div className="auth-form-wrapper">
                <div className="auth-form-inner-content">
                  <div className="auth-modal-header">
                      <span className="section-tag">// CREATE_ACCOUNT</span>
                      <h2 className="auth-modal-title glitch-text" data-text="ĐĂNG KÝ">ĐĂNG KÝ</h2>
                  </div>

                  {error && isSignUp && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}

                  <form onSubmit={handleRegister} className="auth-form">
                      <div className="auth-field">
                          <label>Họ và tên</label>
                          <div className="auth-input-wrapper">
                          <User size={18} className="auth-input-icon" />
                          <input type="text" placeholder="Nguyễn Văn A" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                          </div>
                      </div>

                      <div className="auth-field">
                          <label>Tên đăng nhập</label>
                          <div className="auth-input-wrapper">
                          <User size={18} className="auth-input-icon" />
                          <input type="text" placeholder="Tên đăng nhập" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required autoComplete="username" />
                          </div>
                      </div>

                      <div className="auth-field">
                          <label>Mật khẩu</label>
                          <div className="auth-input-wrapper">
                          <Lock size={18} className="auth-input-icon" />
                          <input type={showRegPass ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
                          <button type="button" className="auth-toggle-pass" onClick={() => setShowRegPass(!showRegPass)} tabIndex={-1}>
                              {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          </div>
                      </div>

                      <div className="auth-field">
                          <label>Xác nhận mật khẩu</label>
                          <div className="auth-input-wrapper">
                          <Lock size={18} className="auth-input-icon" />
                          <input type={showRegPass ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required autoComplete="new-password" />
                          </div>
                      </div>

                      <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                          {isLoading ? <div className="auth-spinner" /> : <><UserPlus size={18} /><span>Đăng Ký</span><ArrowRight size={16} /></>}
                      </button>
                  </form>
                  
                  <div className="auth-social-compact">
                    <span>Hoặc qua</span>
                    <button type="button" className="auth-social-btn-small google" onClick={() => googleLogin()}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button type="button" className="auth-social-btn-small facebook" onClick={handleNativeFacebookLogin}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>
                  
                  {/* Show on mobile only */}
                  <div className="mobile-auth-switch">
                    Đã có tài khoản? <button onClick={() => switchMode(false)}>Đăng nhập</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign In Form */}
            <div className="auth-form-container sign-in-container">
               <div className="auth-form-wrapper">
                <div className="auth-form-inner-content">
                  <AnimatePresence mode="wait">
                  {/* ====== FORGOT PASSWORD FLOW ====== */}
                  {forgotStep ? (
                    <motion.div key={`forgot-${forgotStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                      {/* Forgot: Step EMAIL */}
                      {forgotStep === 'email' && (
                        <>
                          <div className="auth-modal-header">
                            <span className="section-tag">// BƯỚC 1/3</span>
                            <h2 className="auth-modal-title glitch-text" data-text="QUÊN MẬT KHẨU">QUÊN MẬT KHẨU</h2>
                            <p className="auth-form-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nhập email đã đăng ký để nhận mã xác thực</p>
                          </div>
                          {error && <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} />{error}</div>}
                          <form onSubmit={handleForgotSendOTP} className="auth-form">
                            <div className="auth-field">
                              <label>Email đã đăng ký</label>
                              <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input type="email" placeholder="you@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required autoFocus />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                              {isLoading ? <div className="auth-spinner" /> : <><Mail size={18} /><span>Gửi Mã OTP</span><ArrowRight size={16} /></>}
                            </button>
                          </form>
                          <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button type="button" className="auth-forgot-link" onClick={exitForgotPassword} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <ArrowLeft size={14} /> Quay lại Đăng nhập
                            </button>
                          </div>
                        </>
                      )}

                      {/* Forgot: Step OTP */}
                      {forgotStep === 'otp' && (
                        <>
                          <div className="auth-modal-header">
                            <span className="section-tag">// BƯỚC 2/3</span>
                            <h2 className="auth-modal-title glitch-text" data-text="XÁC THỰC OTP">XÁC THỰC OTP</h2>
                            <p className="auth-form-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nhập mã 6 số đã gửi đến <strong style={{ color: 'var(--cyan)' }}>{forgotEmail}</strong></p>
                          </div>
                          {error && <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} />{error}</div>}
                          <form onSubmit={handleForgotVerifyOTP} className="auth-form">
                            <div className="auth-field">
                              <div style={{ textAlign: 'center', margin: '4px 0 16px' }}>
                                <Fingerprint size={36} color="var(--cyan)" style={{ filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.3))' }} />
                              </div>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {forgotOtp.map((digit, index) => (
                                  <input
                                    key={index}
                                    id={`forgot-otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={digit}
                                    onChange={(e) => handleForgotOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleForgotOtpKeyDown(index, e)}
                                    autoFocus={index === 0}
                                    style={{
                                      width: '44px', height: '52px',
                                      textAlign: 'center', fontSize: '20px', fontWeight: '800',
                                      fontFamily: 'var(--font-mono)',
                                      background: digit ? 'rgba(0,212,255,0.05)' : 'var(--bg-input)',
                                      border: digit ? '2px solid var(--cyan)' : '2px solid var(--border)',
                                      borderRadius: '10px',
                                      color: digit ? 'var(--cyan)' : 'var(--text)',
                                      outline: 'none',
                                      transition: 'all 0.2s ease',
                                      boxShadow: digit ? '0 0 12px rgba(0,212,255,0.15)' : 'none'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || forgotOtp.join('').length !== 6}>
                              {isLoading ? <div className="auth-spinner" /> : <><ShieldCheck size={18} /><span>Xác Thực</span><ArrowRight size={16} /></>}
                            </button>
                          </form>
                          <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            {forgotCountdown > 0 ? (
                              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>Gửi lại sau <span style={{ color: 'var(--cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{forgotCountdown}s</span></p>
                            ) : (
                              <button type="button" className="auth-forgot-link" onClick={handleForgotResendOTP} disabled={isLoading} style={{ fontSize: '12px' }}>Gửi lại mã OTP</button>
                            )}
                          </div>
                        </>
                      )}

                      {/* Forgot: Step RESET */}
                      {forgotStep === 'reset' && (
                        <>
                          <div className="auth-modal-header">
                            <span className="section-tag">// BƯỚC 3/3</span>
                            <h2 className="auth-modal-title glitch-text" data-text="MẬT KHẨU MỚI">MẬT KHẨU MỚI</h2>
                            <p className="auth-form-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tạo mật khẩu mới cho tài khoản</p>
                          </div>
                          {error && <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} />{error}</div>}
                          <form onSubmit={handleForgotResetPassword} className="auth-form">
                            <div className="auth-field">
                              <label>Mật khẩu mới</label>
                              <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input type={showForgotPass ? 'text' : 'password'} placeholder="Ít nhất 6 ký tự" value={forgotNewPass} onChange={(e) => setForgotNewPass(e.target.value)} required minLength={6} autoFocus />
                                <button type="button" className="auth-toggle-pass" onClick={() => setShowForgotPass(!showForgotPass)} tabIndex={-1}>
                                  {showForgotPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                            <div className="auth-field">
                              <label>Xác nhận mật khẩu</label>
                              <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input type={showForgotPass ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={forgotConfirmPass} onChange={(e) => setForgotConfirmPass(e.target.value)} required minLength={6} />
                              </div>
                              {forgotConfirmPass && (
                                <p style={{ fontSize: '11px', marginTop: '4px', fontWeight: '600', color: forgotNewPass === forgotConfirmPass ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {forgotNewPass === forgotConfirmPass ? <><CheckCircle size={12} /> Khớp</> : <><AlertTriangle size={12} /> Không khớp</>}
                                </p>
                              )}
                            </div>
                            <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || forgotNewPass !== forgotConfirmPass}>
                              {isLoading ? <div className="auth-spinner" /> : <><KeyRound size={18} /><span>Đặt Lại Mật Khẩu</span><ArrowRight size={16} /></>}
                            </button>
                          </form>
                        </>
                      )}

                      {/* Forgot: Step SUCCESS */}
                      {forgotStep === 'success' && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                            <div style={{
                              width: '72px', height: '72px', borderRadius: '50%',
                              background: 'rgba(34,197,94,0.1)', border: '3px solid #22c55e',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: '0 auto 20px',
                              boxShadow: '0 0 30px rgba(34,197,94,0.2)'
                            }}>
                              <CheckCircle size={36} color="#22c55e" />
                            </div>
                          </motion.div>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e', marginBottom: '10px' }}>Thành công!</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                            Mật khẩu tài khoản <strong style={{ color: 'var(--cyan)' }}>{forgotEmail}</strong> đã được cập nhật.
                          </p>
                          <button className="btn btn-primary auth-submit" onClick={exitForgotPassword}>
                            <LogIn size={18} /><span>Đăng Nhập Ngay</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                  /* ====== NORMAL LOGIN FORM ====== */
                  <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="auth-modal-header">
                      <span className="section-tag">// AUTHENTICATION</span>
                      <h2 className="auth-modal-title glitch-text" data-text="ĐĂNG NHẬP">ĐĂNG NHẬP</h2>
                  </div>

                  {error && !isSignUp && <div className="auth-error">{error}</div>}

                  <form onSubmit={handleLogin} className="auth-form">
                      <div className="auth-field">
                          <label>Tên đăng nhập</label>
                          <div className="auth-input-wrapper">
                          <User size={18} className="auth-input-icon" />
                          <input type="text" placeholder="Tên đăng nhập" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required autoComplete="username" />
                          </div>
                      </div>

                      <div className="auth-field">
                          <div className="auth-field-header">
                          <label>Mật khẩu</label>
                          <button type="button" className="auth-forgot-link" onClick={() => { setError(''); setForgotStep('email'); }}>Quên mật khẩu?</button>
                          </div>
                          <div className="auth-input-wrapper">
                          <Lock size={18} className="auth-input-icon" />
                          <input type={showLoginPass ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                          <button type="button" className="auth-toggle-pass" onClick={() => setShowLoginPass(!showLoginPass)} tabIndex={-1}>
                              {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          </div>
                      </div>

                      <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                          {isLoading ? <div className="auth-spinner" /> : <><LogIn size={18} /><span>Đăng Nhập</span><ArrowRight size={16} /></>}
                      </button>
                  </form>

                  <div className="auth-social-compact">
                    <span>Hoặc qua</span>
                    <button type="button" className="auth-social-btn-small google" onClick={() => googleLogin()}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button type="button" className="auth-social-btn-small facebook" onClick={handleNativeFacebookLogin}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  {/* Show on mobile only */}
                  <div className="mobile-auth-switch">
                    Chưa có tài khoản? <button onClick={() => switchMode(true)}>Đăng ký</button>
                  </div>
                  </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Overlay Container (Hidden on mobile) */}
            <div className="auth-overlay-container">
              <div className="auth-overlay">
                
                {/* Floating Gaming Shapes */}
                <div className="auth-floating-shapes">
                   <Gamepad2 className="shape shape-1" />
                   <Mouse className="shape shape-2" />
                   <Headphones className="shape shape-3" />
                   <Cpu className="shape shape-4" />
                   <Monitor className="shape shape-5" />
                   <Keyboard className="shape shape-6" />
                   <Crosshair className="shape shape-7" />
                   <Speaker className="shape shape-8" />
                   <HardDrive className="shape shape-9" />
                   <Terminal className="shape shape-10" />
                </div>

                <div className="auth-overlay-panel auth-overlay-left">
                  <span className="auth-modal-logo glitch-text" data-text="EZ4GEAR">EZ4GEAR</span>
                  <h2 className="auth-overlay-title">Chào Mừng Trở Lại!</h2>
                  <p className="auth-overlay-desc">Để giữ kết nối với chúng tôi vui lòng đăng nhập bằng tài khoản của bạn</p>
                  <button className="auth-ghost-btn" onClick={() => switchMode(false)}>Đăng Nhập</button>
                </div>
                <div className="auth-overlay-panel auth-overlay-right">
                  <span className="auth-modal-logo glitch-text" data-text="EZ4GEAR">EZ4GEAR</span>
                  <h2 className="auth-overlay-title">Chào Bạn Mới!</h2>
                  <p className="auth-overlay-desc">Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>
                  <button className="auth-ghost-btn" onClick={() => switchMode(true)}>Đăng Ký</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
