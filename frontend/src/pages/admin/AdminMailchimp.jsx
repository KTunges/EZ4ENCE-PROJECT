import { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, Users } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function AdminMailchimp() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

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
    if (window.confirm('Bạn có chắc muốn đồng bộ lại toàn bộ danh sách khách hàng sang Mailchimp? Tiến trình này sẽ chạy ngầm và có thể mất vài phút.')) {
      try {
        setSyncing(true);
        const res = await adminApi.post('/admin/mailchimp/sync');
        alert(res.data.message || 'Đã bắt đầu đồng bộ.');
      } catch (error) {
        alert(error.response?.data?.detail || 'Lỗi khi kích hoạt đồng bộ.');
      } finally {
        setTimeout(() => setSyncing(false), 2000); // UI feedback
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
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Quản lý đồng bộ khách hàng từ website sang hệ thống Mailchimp.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
    </div>
  );
}
