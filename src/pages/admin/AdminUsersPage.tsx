import React, { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/admin';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ page, per_page: 15, search, type_id: typeFilter, is_active: statusFilter });
      setUsers(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleToggleActive = async (id: number) => {
    try { await adminService.toggleUserActive(id); loadUsers(); } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this user?')) return;
    try { await adminService.deleteUser(id); loadUsers(); } catch (err) { console.error(err); }
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      await adminService.updateUser(editUser.id, editForm);
      setEditUser(null);
      loadUsers();
    } catch (err) { console.error(err); }
  };

  const openEdit = (u: any) => {
    setEditUser(u);
    setEditForm({ full_name: u.full_name, email: u.email, phone: u.phone, is_active: u.is_active });
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, outline: 'none', width: '100%',
  };

  const btnStyle = (bg: string): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 8, border: 'none', background: bg,
    color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
  });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>User Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>{pagination.total_items || 0} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ ...inputStyle, maxWidth: 280 }} />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="">All Types</option>
          <option value="1">Supplier</option>
          <option value="2">Retailer</option>
          <option value="3">Company</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Name', 'Email', 'Phone', 'Type', 'Governorate', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '12px 16px' }}>{u.id}</td>
                    <td style={{ color: '#fff', fontSize: 13, fontWeight: 500, padding: '12px 16px' }}>{u.full_name}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px' }}>{u.email}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px' }}>{u.phone || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}>{u.type_name || '—'}</span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, padding: '12px 16px' }}>{u.gov_name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleToggleActive(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: u.is_active ? '#10B981' : '#EF4444' }} />
                        <span style={{ color: u.is_active ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 500 }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '12px 16px' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(u)} style={btnStyle('rgba(59,130,246,0.2)')}>Edit</button>
                      <button onClick={() => handleDelete(u.id)} style={btnStyle('rgba(239,68,68,0.2)')}>Delete</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...btnStyle('rgba(255,255,255,0.1)'), opacity: page <= 1 ? 0.3 : 1 }}>← Prev</button>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '6px 12px' }}>Page {page} of {pagination.total_pages}</span>
            <button disabled={!pagination.has_next} onClick={() => setPage(page + 1)} style={{ ...btnStyle('rgba(255,255,255,0.1)'), opacity: !pagination.has_next ? 0.3 : 1 }}>Next →</button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setEditUser(null)}>
          <div style={{ background: '#0F2C38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: 480, maxHeight: '80vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>Edit User: {editUser.full_name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Full Name</label>
                <input value={editForm.full_name || ''} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
                <input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Phone</label>
                <input value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={handleEditSave} style={{ ...btnStyle('#FF7000'), padding: '12px 24px', fontSize: 14, flex: 1 }}>Save Changes</button>
                <button onClick={() => setEditUser(null)} style={{ ...btnStyle('rgba(255,255,255,0.1)'), padding: '12px 24px', fontSize: 14 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
