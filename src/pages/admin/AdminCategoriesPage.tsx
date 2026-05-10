import React, { useState, useEffect } from 'react';
import adminService from '@/services/admin';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [form, setForm] = useState({ category_name: '' });

  const load = async () => {
    setLoading(true);
    try { const data = await adminService.getCategories(); setCategories(data || []); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editCat) { await adminService.updateCategory(editCat.id, form); }
      else { await adminService.createCategory(form); }
      setShowModal(false); setEditCat(null); setForm({ category_name: '' }); load();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try { await adminService.deleteCategory(id); load(); } catch (err) { alert('Cannot delete category with products'); }
  };

  const openEdit = (c: any) => { setEditCat(c); setForm({ category_name: c.category_name }); setShowModal(true); };
  const openCreate = () => { setEditCat(null); setForm({ category_name: '' }); setShowModal(true); };

  const inp: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, outline: 'none', width: '100%' };
  const btn = (bg: string): React.CSSProperties => ({ padding: '6px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Category Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{categories.length} categories</p>
        </div>
        <button onClick={openCreate} style={{ ...btn('#FF7000'), padding: '12px 24px', fontSize: 14 }}>+ New Category</button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}><div style={{ width: 40, height: 40, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(255,112,0,0.2), rgba(255,112,0,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📂</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(c)} style={btn('rgba(59,130,246,0.2)')}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={btn('rgba(239,68,68,0.2)')}>Del</button>
                </div>
              </div>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{c.category_name}</h3>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{c.product_count || 0} products</div>
              {c.custom_id && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>ID: {c.custom_id}</div>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0F2C38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: 420 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>{editCat ? 'Edit Category' : 'New Category'}</h3>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 6 }}>Category Name</label>
              <input value={form.category_name} onChange={e => setForm({ ...form, category_name: e.target.value })} style={inp} placeholder="Enter category name" />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleSave} style={{ ...btn('#FF7000'), padding: '12px 24px', fontSize: 14, flex: 1 }}>{editCat ? 'Save' : 'Create'}</button>
              <button onClick={() => setShowModal(false)} style={{ ...btn('rgba(255,255,255,0.1)'), padding: '12px 24px', fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
