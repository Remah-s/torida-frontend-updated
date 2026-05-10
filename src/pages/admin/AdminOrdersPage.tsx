import React, { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/admin';
import type { OrderStatus } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6',
  shipped: '#06B6D4', out_for_delivery: '#14B8A6', delivered: '#10B981',
  cancelled: '#EF4444', refunded: '#EC4899',
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<any>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders({ page, per_page: 15, status: statusFilter });
      setOrders(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleExpand = async (id: number) => {
    if (expandedId === id) { setExpandedId(null); setExpandedOrder(null); return; }
    try {
      const data = await adminService.getOrder(id);
      setExpandedOrder(data);
      setExpandedId(id);
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    try {
      await adminService.updateOrderStatus(id, { status });
      loadOrders();
      if (expandedId === id) handleExpand(id);
    } catch (err) {
      console.error(err);
    }
  };

  const inp: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, outline: 'none' };
  const btn = (bg: string): React.CSSProperties => ({ padding: '6px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Order Management</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{pagination.total_items || 0} total orders</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => { setStatusFilter(''); setPage(1); }} style={{ ...btn(statusFilter === '' ? '#FF7000' : 'rgba(255,255,255,0.08)'), padding: '8px 16px' }}>All</button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{ ...btn(statusFilter === s ? (STATUS_COLORS[s] || '#888') : 'rgba(255,255,255,0.08)'), padding: '8px 16px', textTransform: 'capitalize' }}>{s.replace('_', ' ')}</button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Order ID', 'Buyer', 'Seller', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <React.Fragment key={o.id}>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onClick={() => handleExpand(o.id)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ color: '#FF7000', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>#{o.id}</td>
                      <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '12px 16px' }}>{o.buyer_name || '—'}</td>
                      <td style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '12px 16px' }}>{o.seller_name || '—'}</td>
                      <td style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>E£{o.total_price?.toLocaleString() || '0'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[o.status] || '#888'}20`, color: STATUS_COLORS[o.status] || '#888', border: `1px solid ${STATUS_COLORS[o.status] || '#888'}33`, textTransform: 'capitalize' }}>{o.status?.replace('_', ' ')}</span>
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '12px 16px' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as OrderStatus)} style={{ ...inp, width: 140, padding: '6px 10px', fontSize: 12 }}>
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expandedId === o.id && expandedOrder && (
                      <tr>
                        <td colSpan={7} style={{ padding: '0 16px 16px', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
                            <div>
                              <h4 style={{ color: '#FF7000', fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>Order Items</h4>
                              {(expandedOrder.items || []).map((item: any, i: number) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.product?.product_name || `Product #${item.product_id}`} × {item.quantity}</span>
                                  <span style={{ color: '#FF7000', fontSize: 13, fontWeight: 600 }}>E£{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 style={{ color: '#FF7000', fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>Status History</h4>
                              {(expandedOrder.status_history || []).map((h: any, i: number) => (
                                <div key={i} style={{ padding: '6px 0', borderLeft: '2px solid rgba(255,112,0,0.3)', paddingLeft: 12, marginBottom: 8 }}>
                                  <span style={{ color: STATUS_COLORS[h.status] || '#888', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{h.status?.replace('_', ' ')}</span>
                                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{h.changed_at ? new Date(h.changed_at).toLocaleString() : ''} {h.note && `— ${h.note}`}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {orders.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No orders found</td></tr>}
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

export default AdminOrdersPage;
