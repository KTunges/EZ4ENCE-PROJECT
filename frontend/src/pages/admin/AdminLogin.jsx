import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLoginStep1, adminLoginStep2 } = useAuth();
  
  // Step 1 states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2 states
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await adminLoginStep1(email, password);
      setStep(2);
      setSuccessMsg('Mã OTP đã được gửi. Vui lòng kiểm tra Email.');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      await adminLoginStep2(email, otp);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Xác thực OTP thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', minHeight: '100vh', 
      backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#333', fontFamily: 'Inter, sans-serif', alignItems: 'center', justifyContent: 'center', position: 'relative'
    }}>
      
      {/* Background Dark Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 0 }}></div>
      
      {/* Main Sliding Container */}
      <div style={{ 
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', minHeight: '560px', 
        background: '#ffffff', borderRadius: '24px', overflow: 'hidden', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
      }}>
        
        {/* =========================================
            STEP 2 FORM CONTAINER (LEFT SIDE)
        ========================================= */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', 
          padding: '48px 40px', background: '#ffffff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transition: 'all 0.6s ease-in-out',
          opacity: step === 2 ? 1 : 0,
          pointerEvents: step === 2 ? 'auto' : 'none',
          transform: step === 2 ? 'translateX(0)' : 'translateX(50px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={32} color="#059669" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111', marginBottom: '8px', letterSpacing: '-0.5px' }}>XÁC THỰC 2FA</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Nhập mã bảo mật đã gửi qua email.</p>
          </div>

          {error && step === 2 && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          {successMsg && step === 2 && (
            <div style={{ padding: '12px 16px', background: '#f0fdf4', borderLeft: '4px solid #22c55e', color: '#15803d', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="text" 
                  placeholder="Nhập mã 6 chữ số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  style={{ width: '100%', padding: '16px 20px 16px 50px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#000', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', outline: 'none', transition: 'all 0.2s', textAlign: 'center' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0056b3'; e.target.style.background = '#fff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
              style={{ 
                marginTop: '12px', width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#059669', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: (isLoading || otp.length < 6) ? 'not-allowed' : 'pointer', transition: 'transform 0.1s, opacity 0.2s',
                opacity: (isLoading || otp.length < 6) ? 0.7 : 1, boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
              }}
              onMouseDown={(e) => (!isLoading && otp.length === 6) && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (!isLoading && otp.length === 6) && (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (!isLoading && otp.length === 6) && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? (
                <>ĐANG XỬ LÝ... <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin ml-2"></span></>
              ) : (
                <>XÁC NHẬN ĐĂNG NHẬP <ShieldCheck size={18} /></>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => { setStep(1); setOtp(''); setSuccessMsg(''); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              <ArrowLeft size={16} /> Quay lại đăng nhập
            </button>
          </form>
        </div>


        {/* =========================================
            STEP 1 FORM CONTAINER (RIGHT SIDE)
        ========================================= */}
        <div style={{ 
          position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%', 
          padding: '48px 40px', background: '#ffffff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transition: 'all 0.6s ease-in-out',
          opacity: step === 1 ? 1 : 0,
          pointerEvents: step === 1 ? 'auto' : 'none',
          transform: step === 1 ? 'translateX(0)' : 'translateX(-50px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#e6f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={32} color="#0056b3" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111', marginBottom: '8px', letterSpacing: '-0.5px' }}>ADMIN PORTAL</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Hệ thống quản trị nội bộ EZ4GEAR</p>
          </div>

          {error && step === 1 && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px', letterSpacing: '0.5px' }}>EMAIL NHÂN VIÊN</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="email" 
                  placeholder="admin@ez4gear.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#333', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 86, 179, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px', letterSpacing: '0.5px' }}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#333', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 86, 179, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                marginTop: '12px', width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#0056b3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'transform 0.1s, opacity 0.2s',
                opacity: isLoading ? 0.8 : 1, boxShadow: '0 4px 12px rgba(0, 86, 179, 0.2)'
              }}
              onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? (
                <>ĐANG XỬ LÝ... <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin ml-2"></span></>
              ) : (
                <>TIẾP TỤC <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>


        {/* =========================================
            SLIDING OVERLAY (BRANDING)
        ========================================= */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: step === 1 ? 'translateX(0)' : 'translateX(100%)',
          zIndex: 10,
          boxShadow: step === 1 ? '5px 0 15px rgba(0,0,0,0.1)' : '-5px 0 15px rgba(0,0,0,0.1)'
        }}>
          {/* Content that shows when Step 1 (Branding is on the Left) */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px',
            transition: 'all 0.5s ease-in-out',
            opacity: step === 1 ? 1 : 0,
            transform: step === 1 ? 'translateX(0)' : 'translateX(-20%)',
            pointerEvents: step === 1 ? 'auto' : 'none'
          }}>
            <h1 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '4px', margin: '0 0 8px 0', textShadow: '0 4px 12px rgba(0,0,0,0.3)', color: '#ffffff' }}>EZ4GEAR</h1>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#bfdbfe', margin: '0 0 24px 0', letterSpacing: '1px' }}>ADMINISTRATION</h2>
            <div style={{ width: '40px', height: '4px', background: '#93c5fd', marginBottom: '24px', borderRadius: '2px' }}></div>
            <p style={{ color: '#dbeafe', lineHeight: '1.7', fontSize: '15px', maxWidth: '300px' }}>
              Hệ thống quản trị nội bộ cấp cao. Yêu cầu xác thực bảo mật 2 lớp (2FA) đối với mọi phiên đăng nhập để đảm bảo an toàn.
            </p>
          </div>

          {/* Content that shows when Step 2 (Branding moved to the Right) */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px',
            transition: 'all 0.5s ease-in-out',
            opacity: step === 2 ? 1 : 0,
            transform: step === 2 ? 'translateX(0)' : 'translateX(20%)',
            pointerEvents: step === 2 ? 'auto' : 'none'
          }}>
            <h1 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '4px', margin: '0 0 8px 0', textShadow: '0 4px 12px rgba(0,0,0,0.3)', color: '#ffffff' }}>BẢO MẬT</h1>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#a7f3d0', margin: '0 0 24px 0', letterSpacing: '1px' }}>2-FACTOR AUTHENTICATION</h2>
            <div style={{ width: '40px', height: '4px', background: '#6ee7b7', marginBottom: '24px', borderRadius: '2px' }}></div>
            <p style={{ color: '#d1fae5', lineHeight: '1.7', fontSize: '15px', maxWidth: '300px' }}>
              Mã bảo mật đã được gửi đến email đăng ký của bạn. Vui lòng nhập mã để tiếp tục truy cập vào hệ thống.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
