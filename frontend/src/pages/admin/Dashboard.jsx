import { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingCart, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { getDashboardStats } from '../../services/adminApi';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 1240,
    newCustomers: 12
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        setDashboardData(prev => ({ ...prev, ...stats }));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard", error);
      }
    };
    fetchStats();
  }, []);
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const stats = [
    { title: 'Tổng doanh thu', value: formatCurrency(dashboardData.totalRevenue), trend: '+12.5%', isPositive: true, icon: <DollarSign size={24} /> },
    { title: 'Đơn hàng mới', value: dashboardData.totalOrders.toString(), trend: '+5.2%', isPositive: true, icon: <ShoppingCart size={24} /> },
    { title: 'Khách hàng mới', value: dashboardData.newCustomers.toString(), trend: '-2.4%', isPositive: false, icon: <Users size={24} /> },
    { title: 'Tổng sản phẩm', value: dashboardData.activeProducts.toString(), trend: '+0.0%', isPositive: true, icon: <Package size={24} /> }
  ];

  const revenueData = [
    { name: 'T2', current: 15, prev: 12 },
    { name: 'T3', current: 22, prev: 18 },
    { name: 'T4', current: 18, prev: 20 },
    { name: 'T5', current: 28, prev: 25 },
    { name: 'T6', current: 35, prev: 30 },
    { name: 'T7', current: 48, prev: 42 },
    { name: 'CN', current: 52, prev: 45 },
  ];

  const orderData = [
    { name: 'CPU', sales: 120 },
    { name: 'VGA', sales: 85 },
    { name: 'RAM', sales: 250 },
    { name: 'Main', sales: 110 },
    { name: 'SSD', sales: 180 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan Dashboard</h1>
      
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
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Biểu đồ doanh thu (Tuần)</h2>
          <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="prev" name="Tuần trước" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="current" name="Tuần này" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0, fill: '#38bdf8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', minHeight: '400px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Đơn hàng gần đây</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: i !== 5 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>#{i}A</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Khách hàng {i}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vừa xong</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>24.5M</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
