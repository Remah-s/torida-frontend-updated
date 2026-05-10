import React, { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/admin';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getProducts({ page, per_page: 15, search, category_id: catFilter, is_active: statusFilter });
      setProducts(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, catFilter, statusFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { adminService.getCategories().then(setCategories).catch(console.error); }, []);

  const handleToggle = async (id: number) => {
    try { await adminService.toggleProductActive(id); loadProducts(); } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try { await adminService.deleteProduct(id); loadProducts(); } catch (err) { console.error(err); }
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setEditForm({ product_name: p.product_name, price: p.price, stock_quantity: p.stock_quantity, description: p.description || '' });
  };

  const handleSave = async () => {
    if (!editProduct) return;
    try { await adminService.updateProduct(editProduct.id, editForm); setEditProduct(null); loadProducts(); } catch (err) { console.error(err); }
  };

  const inp: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, outline: 'none', width: '100%' };
  const btn = (bg: string): React.CSSProperties => ({ padding: '6px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Product Management</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{pagination.total_items || 0} total products</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ ...inp, maxWidth: 280 }} />
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} style={{ ...inp, maxWidth: 180 }}>
          <option value="">All Categories</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ ...inp, maxWidth: 160 }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
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
                <tr>{['ID', 'Product', 'Category', 'Seller', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '12px 16px' }}>{p.custom_id || p.id}</td>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.primary_image && <img src={p.primary_image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />}
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{p.product_name}</span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px' }}>{p.category_name || '—'}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px' }}>{p.seller_name || '—'}</td>
                    <td style={{ color: '#FF7000', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>E£{p.price?.toLocaleString()}</td>
                    <td style={{ color: p.stock_quantity > 0 ? '#10B981' : '#EF4444', fontSize: 13, fontWeight: 600, padding: '12px 16px' }}>{p.stock_quantity}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleToggle(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.is_active ? '#10B981' : '#EF4444' }} />
                        <span style={{ color: p.is_active ? '#10B981' : '#EF4444', fontSize: 12 }}>{p.is_active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={btn('rgba(59,130,246,0.2)')}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={btn('rgba(239,68,68,0.2)')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No products found</td></tr>}
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

      {editProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setEditProduct(null)}>
          <div style={{ background: '#0F2C38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: 480 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>Edit Product</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>Product Name</label>
                <input value={editForm.product_name || ''} onChange={e => setEditForm({ ...editForm, product_name: e.target.value })} style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>Price (E£)</label>
                  <input type="number" value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} style={inp} />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>Stock</label>
                  <input type="number" value={editForm.stock_quantity || ''} onChange={e => setEditForm({ ...editForm, stock_quantity: parseInt(e.target.value) })} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ ...inp, minHeight: 80, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleSave} style={{ ...btn('#FF7000'), padding: '12px 24px', fontSize: 14, flex: 1 }}>Save</button>
                <button onClick={() => setEditProduct(null)} style={{ ...btn('rgba(255,255,255,0.1)'), padding: '12px 24px', fontSize: 14 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
