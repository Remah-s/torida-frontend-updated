import React, { useState, useEffect } from 'react';
import adminService from '@/services/admin';

const StatCard: React.FC<{ label: string; value: string | number; icon: string; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    transition: 'all 0.3s ease',
    cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, flexShrink: 0, border: `1px solid ${color}33`,
    }}>{icon}</div>
    <div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6',
    shipped: '#06B6D4', delivered: '#10B981', cancelled: '#EF4444', refunded: '#EC4899',
  };
  const c = colors[status] || '#94A3B8';
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: `${c}20`, color: c, border: `1px solid ${c}33`, textTransform: 'capitalize',
    }}>{status}</span>
  );
};

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const s = stats || {};

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>Welcome back, Admin. Here's your platform overview.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Users" value={s.total_users || 0} icon="👥" color="#3B82F6" sub={`${s.active_users || 0} active`} />
        <StatCard label="Total Products" value={s.total_products || 0} icon="📦" color="#10B981" sub={`${s.active_products || 0} active`} />
        <StatCard label="Total Orders" value={s.total_orders || 0} icon="🛒" color="#F59E0B" sub={`${s.pending_orders || 0} pending`} />
        <StatCard label="Total Revenue" value={`E£${(s.total_revenue || 0).toLocaleString()}`} icon="💰" color="#FF7000" sub={`E£${(s.monthly_revenue || 0).toLocaleString()} this month`} />
      </div>

      {/* Breakdowns Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* User Types */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>User Breakdown</h3>
          {(s.user_type_breakdown || []).map((t: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{t.type}</span>
              <span style={{ color: '#FF7000', fontWeight: 700, fontSize: 18 }}>{t.count}</span>
            </div>
          ))}
          {(!s.user_type_breakdown || s.user_type_breakdown.length === 0) && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No user data available</p>
          )}
        </div>

        {/* Order Status */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Order Status</h3>
          {(s.order_status_breakdown || []).map((o: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <StatusBadge status={o.status} />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{o.count}</span>
            </div>
          ))}
          {(!s.order_status_breakdown || s.order_status_breakdown.length === 0) && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No order data available</p>
          )}
        </div>
      </div>

      {/* Recent Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Orders */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Recent Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Buyer', 'Total', 'Status'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {(s.recent_orders || []).slice(0, 8).map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '10px 12px' }}>#{o.id}</td>
                    <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '10px 12px' }}>{o.buyer_name || '—'}</td>
                    <td style={{ color: '#FF7000', fontSize: 13, fontWeight: 600, padding: '10px 12px' }}>E£{o.total_price?.toLocaleString() || '0'}</td>
                    <td style={{ padding: '10px 12px' }}><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Recent Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'Type', 'Active'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {(s.recent_users || []).slice(0, 8).map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '10px 12px' }}>{u.full_name}</td>
                    <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '10px 12px' }}>{u.email}</td>
                    <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '10px 12px' }}>{u.type_name || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: u.is_active ? '#10B981' : '#EF4444', display: 'inline-block' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
