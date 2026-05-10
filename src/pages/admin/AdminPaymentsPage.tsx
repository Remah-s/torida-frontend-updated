import React, { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/admin';

const STATUS_COLORS: Record<string, string> = { unpaid: '#F59E0B', paid: '#10B981', failed: '#EF4444', refunded: '#EC4899' };

const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPayments({ page, per_page: 15, status: statusFilter });
      setPayments(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: number, status: string) => {
    try { await adminService.updatePaymentStatus(id, status); load(); } catch (err) { console.error(err); }
  };

  const inp: React.CSSProperties = { padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 12, outline: 'none' };
  const btn = (bg: string): React.CSSProperties => ({ padding: '6px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Payment Management</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{pagination.total_items || 0} total payments</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['', 'unpaid', 'paid', 'failed', 'refunded'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{ ...btn(statusFilter === s ? (STATUS_COLORS[s] || '#FF7000') : 'rgba(255,255,255,0.08)'), padding: '8px 16px', textTransform: 'capitalize' }}>{s || 'All'}</button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><div style={{ width: 40, height: 40, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Order ID', 'Amount', 'Method', 'Status', 'Transaction ID', 'Paid At', 'Action'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '12px 16px' }}>#{p.id}</td>
                    <td style={{ color: '#FF7000', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>#{p.order_id}</td>
                    <td style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>E£{p.amount?.toLocaleString()}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px', textTransform: 'capitalize' }}>{p.method?.replace('_', ' ')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[p.status] || '#888'}20`, color: STATUS_COLORS[p.status] || '#888', textTransform: 'capitalize' }}>{p.status}</span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '12px 16px' }}>{p.transaction_id || '—'}</td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '12px 16px' }}>{p.paid_at ? new Date(p.paid_at).toLocaleString() : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select value={p.status} onChange={e => handleStatusChange(p.id, e.target.value)} style={{ ...inp, width: 120 }}>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No payments found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        {pagination.total_pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...btn('rgba(255,255,255,0.1)'), opacity: page <= 1 ? 0.3 : 1 }}>← Prev</button>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '6px 12px' }}>Page {page} of {pagination.total_pages}</span>
            <button disabled={!pagination.has_next} onClick={() => setPage(page + 1)} style={{ ...btn('rgba(255,255,255,0.1)'), opacity: !pagination.has_next ? 0.3 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
