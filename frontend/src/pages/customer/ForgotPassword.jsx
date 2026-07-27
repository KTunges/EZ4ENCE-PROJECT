import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, ShieldCheck, CheckCircle, Fingerprint, AlertTriangle } from 'lucide-react';
import CyberBackground from '../../components/ui/CyberBackground';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // Steps: 'email' -> 'otp' -> 'reset' -> 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Có lỗi xảy ra');
      setStep('otp');
      startCountdown();
      window.toast?.success('Mã OTP đã được gửi đến email của bạn!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      const newOtp = [...otp];
      digits.split('').forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      document.getElementById(`otp-${Math.min(index + digits.length, 5)}`)?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Vui lòng nhập đủ 6 số OTP'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Mã OTP không chính xác');
      setStep('reset');
      window.toast?.success('Xác thực OTP thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.detail || 'Có lỗi xảy ra'); }
      setOtp(['', '', '', '', '', '']);
      startCountdown();
      window.toast?.success('Đã gửi lại mã OTP!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Có lỗi xảy ra');
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { level: 0, label: '', color: '' };
    if (newPassword.length < 6) return { level: 1, label: 'Yếu', color: '#ef4444' };
    if (newPassword.length < 8) return { level: 2, label: 'Trung bình', color: '#f59e0b' };
    if (newPassword.length < 12) return { level: 3, label: 'Mạnh', color: '#22c55e' };
    return { level: 4, label: 'Rất mạnh', color: '#00d4ff' };
  };

  const STEPS_DATA = [
    { key: 'email', label: 'Nhập email', icon: <Mail size={16} /> },
    { key: 'otp', label: 'Xác thực OTP', icon: <ShieldCheck size={16} /> },
    { key: 'reset', label: 'Mật khẩu mới', icon: <KeyRound size={16} /> }
  ];

  const stepOrder = ['email', 'otp', 'reset', 'success'];
  const currentIdx = stepOrder.indexOf(step);

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
            <Link to="/" className="auth-logo glitch-text" data-text="EZ4GEAR">EZ4GEAR</Link>
            <h2 className="auth-branding-title">Khôi Phục Tài Khoản</h2>
            <p className="auth-branding-desc">
              Đừng lo lắng! Chỉ cần vài bước đơn giản là bạn sẽ lấy lại quyền truy cập tài khoản ngay.
            </p>
            
            {/* Progress Steps */}
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {STEPS_DATA.map((s, i) => {
                const isActive = i === currentIdx;
                const isDone = i < currentIdx;
                
                return (
                  <div key={s.key} style={{ display: 'flex', alignItems: 'stretch', gap: '16px' }}>
                    {/* Step indicator column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <motion.div 
                        animate={{ 
                          scale: isActive ? 1 : 1,
                          boxShadow: isActive ? '0 0 20px rgba(0, 212, 255, 0.4)' : isDone ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'none'
                        }}
                        style={{
                          width: '40px', height: '40px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isDone ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                            : isActive ? 'linear-gradient(135deg, var(--cyan), #0ea5e9)' 
                            : 'rgba(255,255,255,0.03)',
                          border: isActive ? '2px solid var(--cyan)' : isDone ? '2px solid #22c55e' : '2px solid var(--border)',
                          color: (isDone || isActive) ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.4s ease',
                          flexShrink: 0
                        }}
                      >
                        {isDone ? <CheckCircle size={18} /> : s.icon}
                      </motion.div>
                      {/* Connector line */}
                      {i < STEPS_DATA.length - 1 && (
                        <div style={{
                          width: '2px', flex: 1, minHeight: '24px',
                          background: i < currentIdx 
                            ? 'linear-gradient(180deg, #22c55e, var(--border))' 
                            : 'var(--border)',
                          transition: 'background 0.4s ease'
                        }} />
                      )}
                    </div>
                    {/* Step label */}
                    <div style={{ paddingBottom: i < STEPS_DATA.length - 1 ? '24px' : '0', paddingTop: '8px' }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: isActive ? '700' : '500',
                        color: isDone ? '#22c55e' : isActive ? 'var(--text)' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                        letterSpacing: isActive ? '0.5px' : '0'
                      }}>
                        {s.label}
                        {isDone && <span style={{ marginLeft: '6px', fontSize: '11px' }}>✓</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right — Form Panel */}
        <motion.div
          className="auth-form-panel"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="auth-form-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header for each step */}
                {step !== 'success' && (
                  <div className="auth-form-header">
                    <span className="section-tag">// BƯỚC {currentIdx + 1}/3</span>
                    <h1 className="auth-form-title glitch-text" data-text={
                      step === 'email' ? 'QUÊN MẬT KHẨU' : step === 'otp' ? 'XÁC THỰC OTP' : 'MẬT KHẨU MỚI'
                    }>
                      {step === 'email' ? 'QUÊN MẬT KHẨU' : step === 'otp' ? 'XÁC THỰC OTP' : 'MẬT KHẨU MỚI'}
                    </h1>
                    <p className="auth-form-subtitle">
                      {step === 'email' ? 'Nhập email đã đăng ký để nhận mã xác thực OTP' 
                       : step === 'otp' ? `Nhập mã 6 số đã gửi đến ${email}`
                       : 'Tạo mật khẩu mới cho tài khoản của bạn'}
                    </p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    className="auth-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <AlertTriangle size={16} />
                    {error}
                  </motion.div>
                )}

                {/* ====== Step 1: Email ====== */}
                {step === 'email' && (
                  <form onSubmit={handleSendOTP} className="auth-form">
                    <div className="auth-field">
                      <label htmlFor="forgot-email">Email đã đăng ký</label>
                      <div className="auth-input-wrapper">
                        <Mail size={18} className="auth-input-icon" />
                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                        💡 Chúng tôi sẽ gửi mã xác thực gồm 6 chữ số đến email này.
                      </p>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="auth-spinner" />
                      ) : (
                        <>
                          <Mail size={18} />
                          <span>Gửi Mã OTP</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ====== Step 2: OTP ====== */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="auth-form">
                    <div className="auth-field">
                      <label style={{ textAlign: 'center', display: 'block' }}>Nhập mã xác thực</label>
                      
                      {/* OTP Icon */}
                      <div style={{ textAlign: 'center', margin: '12px 0 20px' }}>
                        <motion.div
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                          style={{ display: 'inline-flex' }}
                        >
                          <Fingerprint size={40} color="var(--cyan)" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.4))' }} />
                        </motion.div>
                      </div>

                      {/* OTP Inputs */}
                      <div style={{
                        display: 'flex', gap: '10px', justifyContent: 'center'
                      }}>
                        {otp.map((digit, index) => (
                          <motion.input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            autoFocus={index === 0}
                            whileFocus={{ scale: 1.08 }}
                            style={{
                              width: '50px', height: '60px',
                              textAlign: 'center', fontSize: '24px', fontWeight: '800',
                              fontFamily: 'var(--font-mono)',
                              background: digit ? 'rgba(0, 212, 255, 0.05)' : 'var(--bg-input)',
                              border: digit ? '2px solid var(--cyan)' : '2px solid var(--border)',
                              borderRadius: '12px',
                              color: digit ? 'var(--cyan)' : 'var(--text)',
                              outline: 'none',
                              transition: 'all 0.25s ease',
                              boxShadow: digit ? '0 0 16px rgba(0, 212, 255, 0.15), inset 0 0 8px rgba(0, 212, 255, 0.05)' : 'none',
                              caretColor: 'var(--cyan)'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || otp.join('').length !== 6}>
                      {isLoading ? (
                        <div className="auth-spinner" />
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Xác Thực OTP</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {/* Resend / Timer */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      {countdown > 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                          Gửi lại mã sau <span style={{ 
                            color: 'var(--cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)',
                            background: 'rgba(0, 212, 255, 0.1)', padding: '2px 8px', borderRadius: '6px'
                          }}>{countdown}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="auth-forgot-link"
                          style={{ fontSize: '13px' }}
                        >
                          Gửi lại mã OTP
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* ====== Step 3: Reset Password ====== */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="auth-form">
                    <div className="auth-field">
                      <label htmlFor="new-password">Mật khẩu mới</label>
                      <div className="auth-input-wrapper">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Ít nhất 6 ký tự"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          autoFocus
                        />
                        <button type="button" className="auth-toggle-pass" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      
                      {/* Password strength */}
                      {newPassword && (() => {
                        const strength = getPasswordStrength();
                        return (
                          <div style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                              {[1, 2, 3, 4].map(i => (
                                <motion.div 
                                  key={i}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  style={{
                                    flex: 1, height: '4px', borderRadius: '2px',
                                    background: strength.level >= i ? strength.color : 'var(--border)',
                                    transition: 'background 0.3s ease',
                                    transformOrigin: 'left'
                                  }} 
                                />
                              ))}
                            </div>
                            <p style={{ fontSize: '11px', color: strength.color, margin: 0, fontWeight: '600' }}>
                              {strength.label}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="auth-field">
                      <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                      <div className="auth-input-wrapper">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu mới"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button type="button" className="auth-toggle-pass" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {/* Match indicator */}
                      {confirmPassword && (
                        <p style={{ 
                          fontSize: '11px', marginTop: '6px', fontWeight: '600',
                          color: newPassword === confirmPassword ? '#22c55e' : '#ef4444',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                          {newPassword === confirmPassword 
                            ? <><CheckCircle size={12} /> Mật khẩu khớp</>
                            : <><AlertTriangle size={12} /> Mật khẩu không khớp</>
                          }
                        </p>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading || newPassword !== confirmPassword}>
                      {isLoading ? (
                        <div className="auth-spinner" />
                      ) : (
                        <>
                          <KeyRound size={18} />
                          <span>Đặt Lại Mật Khẩu</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ====== Step 4: Success ====== */}
                {step === 'success' && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                    >
                      <div style={{
                        width: '88px', height: '88px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                        border: '3px solid #22c55e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px',
                        boxShadow: '0 0 40px rgba(34, 197, 94, 0.2), inset 0 0 20px rgba(34, 197, 94, 0.05)'
                      }}>
                        <CheckCircle size={44} color="#22c55e" />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#22c55e', letterSpacing: '0.5px' }}>
                        Đặt lại mật khẩu thành công!
                      </h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.7' }}>
                        Mật khẩu tài khoản <strong style={{ color: 'var(--cyan)' }}>{email}</strong> đã được cập nhật thành công. 
                        Bạn có thể đăng nhập ngay bằng mật khẩu mới.
                      </p>
                      
                      <button
                        className="btn btn-primary auth-submit"
                        onClick={() => navigate('/login')}
                      >
                        <ArrowRight size={18} />
                        <span>Đăng Nhập Ngay</span>
                      </button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Back to login link */}
            {step !== 'success' && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link to="/login" className="auth-switch-link" style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px'
                }}>
                  <ArrowLeft size={14} /> Quay lại Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
