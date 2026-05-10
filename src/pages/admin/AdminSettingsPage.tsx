import React, { useState, useEffect } from 'react';
import adminService from '@/services/admin';

const AdminSettingsPage: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');

  useEffect(() => {
    const load = async () => {
      try {
        const [r, p, ut, g] = await Promise.all([
          adminService.getRoles(), adminService.getPermissions(),
          adminService.getUserTypes(), adminService.getGovernorates(),
        ]);
        setRoles(r || []); setPermissions(p || []); setUserTypes(ut || []); setGovernorates(g || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const tabs = [
    { id: 'roles', label: 'Roles & Permissions', icon: '🔑' },
    { id: 'types', label: 'User Types', icon: '👤' },
    { id: 'geo', label: 'Governorates', icon: '🗺️' },
    { id: 'system', label: 'System Info', icon: '⚙️' },
  ];

  const btn = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(255,112,0,0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#FF7000' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,112,0,0.3)', borderTopColor: '#FF7000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>Platform configuration and reference data</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={btn(activeTab === t.id)}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
        {activeTab === 'roles' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>Roles</h3>
            {roles.map(r => (
              <div key={r.id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{r.role_name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>ID: {r.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(r.permissions || []).map((p: any) => (
                    <span key={p.id} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>{p.permission_name}</span>
                  ))}
                  {(!r.permissions || r.permissions.length === 0) && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>No permissions assigned</span>}
                </div>
              </div>
            ))}
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '32px 0 16px' }}>All Permissions</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {permissions.map(p => (
                <span key={p.id} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}>{p.permission_name}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>User Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {userTypes.map((t: any) => (
                <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
                  <div style={{ color: '#FF7000', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{t.id}</div>
                  <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{t.type_name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {t.can_sell && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>Can Sell</span>}
                    {t.can_buy && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(59,130,246,0.1)', color: '#60A5FA' }}>Can Buy</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'geo' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>Governorates ({governorates.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {governorates.map((g: any) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#FF7000', fontWeight: 700, fontSize: 14, width: 28, textAlign: 'center' }}>{g.id}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{g.gov_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>System Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Platform', value: 'TORIDA B2B Marketplace' },
                { label: 'API Version', value: '1.0.0' },
                { label: 'Backend', value: 'Flask + SQLAlchemy' },
                { label: 'Frontend', value: 'React + TypeScript' },
                { label: 'Database', value: 'SQLite / PostgreSQL' },
                { label: 'Auth', value: 'JWT (HS256)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.label}</span>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
