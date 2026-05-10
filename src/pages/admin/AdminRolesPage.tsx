import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit3, ChevronDown, ChevronRight, Check, X, Search, Key, Users, Loader2 } from 'lucide-react';
import { roleService, permissionService } from '@/services';
import { ApiError } from '@/services/api';
import type { Role, Permission } from '@/types';
import toast from 'react-hot-toast';

const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Record<number, Permission[]>>({});

  // Modal state
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showCreatePerm, setShowCreatePerm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newPermName, setNewPermName] = useState('');
  const [searchPerm, setSearchPerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        roleService.getRoles(1, 100),
        permissionService.getPermissions(1, 100),
      ]);
      setRoles(rolesData.items || []);
      setPermissions(permsData.items || []);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load data';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Expand role to show its permissions
  const toggleRole = async (roleId: number) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
      return;
    }
    setExpandedRole(roleId);
    if (!rolePermissions[roleId]) {
      try {
        const perms = await roleService.getRolePermissions(roleId);
        setRolePermissions((prev) => ({ ...prev, [roleId]: perms }));
      } catch {
        toast.error('Failed to load role permissions');
      }
    }
  };

  // Create role
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    setSaving(true);
    try {
      const role = await roleService.createRole(newRoleName.trim());
      setRoles((prev) => [...prev, role]);
      setNewRoleName('');
      setShowCreateRole(false);
      toast.success('Role created successfully');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  // Update role
  const handleUpdateRole = async () => {
    if (!editingRole || !newRoleName.trim()) return;
    setSaving(true);
    try {
      const updated = await roleService.updateRole(editingRole.id, newRoleName.trim());
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditingRole(null);
      setNewRoleName('');
      toast.success('Role updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Delete this role? This will remove it from all users.')) return;
    try {
      await roleService.deleteRole(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      toast.success('Role deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete role');
    }
  };

  // Toggle permission on role
  const togglePermissionOnRole = async (roleId: number, perm: Permission) => {
    const current = rolePermissions[roleId] || [];
    const has = current.some((p) => p.id === perm.id);
    try {
      if (has) {
        await roleService.removePermission(roleId, perm.id);
        setRolePermissions((prev) => ({
          ...prev,
          [roleId]: prev[roleId].filter((p) => p.id !== perm.id),
        }));
      } else {
        await roleService.assignPermission(roleId, perm.id);
        setRolePermissions((prev) => ({
          ...prev,
          [roleId]: [...(prev[roleId] || []), perm],
        }));
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update permission');
    }
  };

  // Create permission
  const handleCreatePermission = async () => {
    if (!newPermName.trim() || !newPermName.includes(':')) {
      toast.error('Permission must be in "resource:action" format');
      return;
    }
    setSaving(true);
    try {
      const perm = await permissionService.createPermission(newPermName.trim());
      setPermissions((prev) => [...prev, perm]);
      setNewPermName('');
      setShowCreatePerm(false);
      toast.success('Permission created');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create permission');
    } finally {
      setSaving(false);
    }
  };

  // Delete permission
  const handleDeletePermission = async (permId: number) => {
    if (!confirm('Delete this permission? It will be removed from all roles.')) return;
    try {
      await permissionService.deletePermission(permId);
      setPermissions((prev) => prev.filter((p) => p.id !== permId));
      // Also remove from cached role permissions
      setRolePermissions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((k) => {
          updated[Number(k)] = updated[Number(k)].filter((p) => p.id !== permId);
        });
        return updated;
      });
      toast.success('Permission deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete permission');
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const [resource] = p.permission_name.split(':');
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(p);
    return acc;
  }, {});

  const filteredPermissions = searchPerm
    ? permissions.filter((p) => p.permission_name.toLowerCase().includes(searchPerm.toLowerCase()))
    : permissions;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            Roles & Permissions
          </h1>
          <p className="text-text-secondary mt-1">Manage access control for your platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{roles.length}</p>
              <p className="text-sm text-text-secondary">Total Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{permissions.length}</p>
              <p className="text-sm text-text-secondary">Total Permissions</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{Object.keys(groupedPermissions).length}</p>
              <p className="text-sm text-text-secondary">Resource Groups</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Roles Panel ─────────────────────────────── */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Roles</h2>
            <button
              onClick={() => { setShowCreateRole(true); setNewRoleName(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Role
            </button>
          </div>

          {/* Create / Edit Role Inline Form */}
          {(showCreateRole || editingRole) && (
            <div className="p-4 border-b border-border bg-primary/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Role name..."
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && (editingRole ? handleUpdateRole() : handleCreateRole())}
                />
                <button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  disabled={saving || !newRoleName.trim()}
                  className="px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setShowCreateRole(false); setEditingRole(null); setNewRoleName(''); }}
                  className="px-3 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-surface-elevated transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Roles List */}
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {roles.map((role) => (
              <div key={role.id}>
                <div
                  className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                  onClick={() => toggleRole(role.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {expandedRole === role.id ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{role.role_name}</p>
                      <p className="text-xs text-text-muted">{role.custom_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setEditingRole(role); setNewRoleName(role.role_name); setShowCreateRole(false); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-text-muted hover:text-blue-600 transition-colors"
                      title="Edit role"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded: Permission checkboxes */}
                {expandedRole === role.id && (
                  <div className="px-4 pb-4 bg-surface-elevated/30">
                    <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                      Assigned Permissions ({(rolePermissions[role.id] || []).length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto">
                      {permissions.map((perm) => {
                        const isAssigned = (rolePermissions[role.id] || []).some(
                          (p) => p.id === perm.id
                        );
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              isAssigned
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-surface-elevated text-text-secondary'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => togglePermissionOnRole(role.id, perm)}
                              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                            />
                            {perm.permission_name}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {roles.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                <Shield className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No roles found. Create your first role.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Permissions Panel ───────────────────────── */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Permissions</h2>
            <button
              onClick={() => { setShowCreatePerm(true); setNewPermName(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Permission
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchPerm}
                onChange={(e) => setSearchPerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Create Permission Inline Form */}
          {showCreatePerm && (
            <div className="p-4 border-b border-border bg-green-50">
              <p className="text-xs text-green-700 mb-2">Format: resource:action (e.g. invoices:read)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPermName}
                  onChange={(e) => setNewPermName(e.target.value)}
                  placeholder="resource:action"
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePermission()}
                />
                <button
                  onClick={handleCreatePermission}
                  disabled={saving}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setShowCreatePerm(false); setNewPermName(''); }}
                  className="px-3 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-surface-elevated transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Permissions grouped by resource */}
          <div className="max-h-[500px] overflow-y-auto">
            {searchPerm ? (
              <div className="divide-y divide-border">
                {filteredPermissions.map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-elevated/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-sm text-text-primary font-mono">{perm.permission_name}</span>
                    </div>
                    <button
                      onClick={() => handleDeletePermission(perm.id)}
                      className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {filteredPermissions.length === 0 && (
                  <p className="p-4 text-center text-sm text-text-muted">No matching permissions</p>
                )}
              </div>
            ) : (
              Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="border-b border-border last:border-0">
                  <div className="px-4 py-2.5 bg-surface-elevated/30">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                      {resource} <span className="text-text-muted font-normal">({perms.length})</span>
                    </p>
                  </div>
                  {perms.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between px-4 py-2 hover:bg-surface-elevated/50 transition-colors">
                      <span className="text-sm text-text-primary font-mono">{perm.permission_name}</span>
                      <button
                        onClick={() => handleDeletePermission(perm.id)}
                        className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
            {permissions.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                <Key className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No permissions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPage;
