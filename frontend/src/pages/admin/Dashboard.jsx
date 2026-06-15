import { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingCart, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { getDashboardStats } from '../../services/adminApi';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    totalCustomers: 0,
    revenueChart: [],
    recentOrders: []
  });

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await getDashboardStats(period);
        setDashboardData(stats);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const stats = [
    { title: 'Tổng doanh thu', value: formatCurrency(dashboardData.totalRevenue), trend: '+12.5%', isPositive: true, icon: <DollarSign size={24} /> },
    { title: 'Tổng đơn hàng', value: dashboardData.totalOrders.toString(), trend: '+5.2%', isPositive: true, icon: <ShoppingCart size={24} /> },
    { title: 'Khách hàng', value: dashboardData.totalCustomers?.toString() || '0', trend: '+1.4%', isPositive: true, icon: <Users size={24} /> },
    { title: 'Sản phẩm', value: dashboardData.activeProducts.toString(), trend: '+0.0%', isPositive: true, icon: <Package size={24} /> }
  ];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}><div className="spinner-border text-cyan"></div></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Tổng quan Dashboard</h1>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {['week', 'month', 'year'].map(p => (
            <button 
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: period === p ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: period === p ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: period === p ? 'bold' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '13px'
              }}
            >
              {p === 'week' ? '7 Ngày' : p === 'month' ? '30 Ngày' : '1 Năm'}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{stat.title}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: stat.isPositive ? '#00e676' : '#ff1744' }}>
              {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{stat.trend} so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>Biểu đồ doanh thu</h2>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.revenueChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--text)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0, fill: '#38bdf8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '400px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Đơn hàng gần đây</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dashboardData.recentOrders.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Chưa có đơn hàng nào</div>
            ) : dashboardData.recentOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  #{o.order_code.slice(-4)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{o.user_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleDateString('vi-VN')}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{formatCurrency(o.total_amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
