import { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, Users, Send } from 'lucide-react';
import adminApi from '../../services/adminApi';

const DEFAULT_TEMPLATE = `Xin chào *|FNAME|* 👋,

Đã đến lúc đưa trải nghiệm Gaming và không gian làm việc của bạn lên một tầm cao mới 🚀. Đội ngũ EZ4GEAR đã chuẩn bị riêng cho bạn một đặc quyền chưa từng có trong tháng này 🎁.

** ĐẶC QUYỀN VIP: ƯU ĐÃI KHỦNG LÊN ĐẾN 30% KHI BUILD PC CAO CẤP 🔥 **
--------------------------------------------------
Áp dụng độc quyền cho linh kiện RTX 40-Series & CPU Intel Gen 14 mới nhất.
Mã giảm giá đã được kích hoạt ngầm vào tài khoản của bạn. Chỉ cần đăng nhập và tiến hành mua sắm, hệ thống sẽ tự động áp dụng ưu đãi tại bước thanh toán.

👉 Lên Cấu Hình Ngay (https://ez4gear.com/products)

EZ4GEAR Store
Hệ sinh thái thiết bị Gaming & Công nghệ hàng đầu.

Bạn nhận được email này vì đã đăng ký thành viên tại EZ4GEAR.
Nhấn vào đây để huỷ nhận tin (Unsubscribe): *|UNSUB|*`;

export default function AdminMailchimp() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Campaign State
  const [subject, setSubject] = useState('EZ4GEAR - Ưu đãi đặc quyền dành riêng cho bạn! 🎁');
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [targetEmails, setTargetEmails] = useState('');
  const [sending, setSending] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/admin/mailchimp/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch mailchimp stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleManualSync = async () => {
    if (await window.customConfirm('Bạn có chắc muốn đồng bộ lại toàn bộ danh sách khách hàng sang Mailchimp? Tiến trình này sẽ chạy ngầm và có thể mất vài phút.')) {
      try {
        setSyncing(true);
        const res = await adminApi.post('/admin/mailchimp/sync');
        window.toast.info(res.data.message || 'Đã bắt đầu đồng bộ.');
      } catch (error) {
        window.toast.error(error.response?.data?.detail || 'Lỗi khi kích hoạt đồng bộ.');
      } finally {
        setTimeout(() => setSyncing(false), 2000); // UI feedback
      }
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      window.toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung email!");
      return;
    }
    
    if (await window.customConfirm('Bạn có chắc chắn muốn gửi chiến dịch Email này đi không? Hành động này không thể hoàn tác.')) {
      try {
        setSending(true);
        const res = await adminApi.post('/admin/mailchimp/campaign', {
          subject,
          content,
          target_emails: targetEmails.trim() || null
        });
        window.toast.success(res.data.message || 'Gửi chiến dịch thành công!');
        setContent(DEFAULT_TEMPLATE); // Reset template
      } catch (error) {
        window.toast.error(error.response?.data?.detail || 'Lỗi khi gửi chiến dịch.');
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={28} color="#FFE01B" /> Email Marketing
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Quản lý đồng bộ khách hàng và gửi chiến dịch Email từ website sang hệ thống Mailchimp.</p>
        </div>
        <a
          href="https://mailchimp.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#FFE01B', color: '#000', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          Mở Dashboard Mailchimp
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Khách hàng hợp lệ (Đã xác thực)</div>
              {loading ? (
                <div className="spinner-border text-cyan" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              ) : (
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats?.verified_users || 0}</div>
              )}
            </div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontWeight: 'bold', marginBottom: '4px' }}>
              <CheckCircle size={14} /> Tự động đồng bộ
            </div>
            Khách hàng sẽ được <strong>TỰ ĐỘNG</strong> thêm vào danh sách (Audience) trên Mailchimp ngay khi họ:
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
              <li>Xác thực mã OTP thành công.</li>
              <li>Đăng nhập thành công bằng tài khoản Google hoặc Facebook.</li>
            </ul>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Đồng bộ thủ công</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            Nếu bạn mới kết nối Mailchimp hoặc nghi ngờ có dữ liệu bị sót, bạn có thể quét lại toàn bộ database để đồng bộ cưỡng bức tất cả tài khoản hợp lệ lên Mailchimp.
          </p>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            style={{
              marginTop: 'auto', background: syncing ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-dark)',
              color: syncing ? '#666' : 'var(--text)', border: '1px solid var(--border)',
              padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={18} className={syncing ? 'spin' : ''} color={syncing ? '#666' : 'var(--cyan)'} />
            {syncing ? 'Đang kích hoạt đồng bộ...' : 'Chạy Đồng Bộ Cưỡng Bức'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          Tạo Chiến dịch Email (Plain-Text)
        </h2>
        
        <form onSubmit={handleSendCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Tiêu đề Email (Subject):</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề email..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text)' }}
              />
            </div>
            <div style={{ flex: '0 1 250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Gửi cho (Email cụ thể):</label>
              <input 
                type="text"
                value={targetEmails}
                onChange={e => setTargetEmails(e.target.value)}
                placeholder="VD: a@gmail.com, b@gmail.com (Bỏ trống = gửi tất cả)"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Nội dung Email (Plain Text):</span>
              <span style={{ fontSize: '12px', fontWeight: 'normal' }}>* Hỗ trợ tag: *|FNAME|*, *|UNSUB|*</span>
            </label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={12}
              style={{ 
                width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', 
                background: 'var(--bg-dark)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '14px',
                lineHeight: '1.5', resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={sending}
              style={{
                background: sending ? 'rgba(56, 189, 248, 0.5)' : 'var(--cyan)',
                color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', 
                cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}
            >
              {sending ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
              {sending ? 'Đang gửi chiến dịch...' : 'Phát Tán Email Hàng Loạt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
