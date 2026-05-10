import React, { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/admin';

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getReviews({ page, per_page: 15, rating: ratingFilter });
      setReviews(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, ratingFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try { await adminService.deleteReview(id); load(); } catch (err) { console.error(err); }
  };

  const stars = (r: number) => '★'.repeat(r) + '☆'.repeat(5 - r);
  const btn = (bg: string): React.CSSProperties => ({ padding: '6px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Review Moderation</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{pagination.total_items || 0} total reviews</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => { setRatingFilter(''); setPage(1); }} style={{ ...btn(ratingFilter === '' ? '#FF7000' : 'rgba(255,255,255,0.08)'), padding: '8px 16px' }}>All</button>
        {[5, 4, 3, 2, 1].map(r => (
          <button key={r} onClick={() => { setRatingFilter(String(r)); setPage(1); }}
            style={{ ...btn(ratingFilter === String(r) ? '#FF7000' : 'rgba(255,255,255,0.08)'), padding: '8px 16px' }}>
            {r}★
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><div style={{ width: 40, height: 40, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} /></div>
        ) : (
          <div>
            {reviews.map(r => (
              <div key={r.id} style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ color: '#F59E0B', fontSize: 16, letterSpacing: 2 }}>{stars(r.rating)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>#{r.id}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 8px', lineHeight: 1.5 }}>{r.comment || <em style={{ color: 'rgba(255,255,255,0.3)' }}>No comment</em>}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    <span>By: {r.user_name || `User #${r.user_id}`}</span>
                    <span>Product: #{r.product_id}</span>
                    <span>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} style={btn('rgba(239,68,68,0.2)')}>Delete</button>
              </div>
            ))}
            {reviews.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No reviews found</div>}
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

export default AdminReviewsPage;
