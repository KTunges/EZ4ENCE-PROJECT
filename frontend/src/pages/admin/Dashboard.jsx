import { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingCart, Package, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats } from '../../services/adminApi';
import { downloadReport } from '../../utils/exportUtils';
import { DownloadCloud } from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    totalCustomers: 0,
    revenueChart: [],
    recentOrders: [],
    orderStatusDistribution: [],
    topProducts: [],
    lowStockItems: []
  });

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [showExport, setShowExport] = useState(false);

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

  const translateStatus = (status) => {
    const map = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao',
      'CANCELLED': 'Đã huỷ'
    };
    return map[status] || status;
  };

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
    <div className="admin-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Tổng quan Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowExport(!showExport)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <DownloadCloud size={18} /> Xuất dữ liệu <ChevronDown size={14} />
            </button>
            {showExport && (
              <div className="glass" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', borderRadius: '12px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('admin_token');
                    downloadReport(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/reports/revenue/export?format=csv`, token, 'Revenue_Report.csv');
                    setShowExport(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(128,128,128,0.15)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  <DownloadCloud size={16} /> Xuất File CSV
                </button>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('admin_token');
                    downloadReport(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/reports/revenue/export?format=xlsx`, token, 'Revenue_Report.xlsx');
                    setShowExport(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(128,128,128,0.15)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  <DownloadCloud size={16} /> Xuất File Excel
                </button>
              </div>
            )}
          </div>
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
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value) => [formatCurrency(value), 'Doanh thu']}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Trạng thái đơn hàng</h2>
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.orderStatusDistribution.slice().sort((a, b) => {
                    const order = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
                    return order.indexOf(a.name) - order.indexOf(b.name);
                  })}
                  startAngle={90}
                  endAngle={-270}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {dashboardData.orderStatusDistribution.slice().sort((a, b) => {
                    const order = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
                    return order.indexOf(a.name) - order.indexOf(b.name);
                  }).map((entry, index) => {
                    const STATUS_COLORS = { 'PENDING': '#f59e0b', 'CONFIRMED': '#38bdf8', 'SHIPPING': '#a855f7', 'DELIVERED': '#22c55e', 'CANCELLED': '#ef4444' };
                    return <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, translateStatus(name)]}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom HTML Legend for perfect alignment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', marginTop: '10px' }}>
            {dashboardData.orderStatusDistribution.slice().sort((a, b) => {
              const order = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
              return order.indexOf(a.name) - order.indexOf(b.name);
            }).map((entry, index) => {
              const STATUS_COLORS = { 'PENDING': '#f59e0b', 'CONFIRMED': '#38bdf8', 'SHIPPING': '#a855f7', 'DELIVERED': '#22c55e', 'CANCELLED': '#ef4444' };
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: STATUS_COLORS[entry.name] || '#94a3b8' }}></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{translateStatus(entry.name)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Top 5 Sản phẩm bán chạy</h2>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.topProducts} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + '...' : val} tick={{fill: 'var(--text)', fontSize: 11}} width={100} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(128,128,128,0.15)'}}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px', maxWidth: '300px', whiteSpace: 'normal' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Bar dataKey="sold" name="Đã bán" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '300px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} /> Sắp hết hàng
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dashboardData.lowStockItems.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Kho hàng đang ổn định</div>
            ) : dashboardData.lowStockItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product_name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.sku_code}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: item.stock === 0 ? '#ef4444' : '#f59e0b', background: item.stock === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    Còn {item.stock}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
