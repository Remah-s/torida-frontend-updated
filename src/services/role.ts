// ============================================================
// Role Service — /api/roles
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type {
  Role,
  Permission,
  PaginatedData,
  BulkPermissionResult,
  BulkRoleResult,
} from '@/types';

export const roleService = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  3.1 — Roles CRUD
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ─── List Roles (paginated) ─────────────────────────────
  // GET /api/roles?page=1&per_page=20
  //
  // Example:
  //   const result = await roleService.getRoles(1, 20);
  //   result.items.forEach(r => console.log(r.role_name));
  //
  async getRoles(page = 1, perPage = 20): Promise<PaginatedData<Role>> {
    return await api.getPaginated<Role>(
      `/roles?page=${page}&per_page=${perPage}`
    );
  },

  // ─── Get Single Role (with permissions) ─────────────────
  // GET /api/roles/:role_id
  //
  async getRole(roleId: number): Promise<Role> {
    const response = await api.get<Role>(`/roles/${roleId}`);
    return response.data;
  },

  // ─── Create Role ────────────────────────────────────────
  // POST /api/roles   body: { role_name: "Moderator" }
  //
  // Example:
  //   const newRole = await roleService.createRole('Moderator');
  //
  async createRole(roleName: string): Promise<Role> {
    const response = await api.post<Role>('/roles', { role_name: roleName });
    return response.data;
  },

  // ─── Update Role ────────────────────────────────────────
  // PUT /api/roles/:role_id   body: { role_name: "Super Admin" }
  //
  async updateRole(roleId: number, roleName: string): Promise<Role> {
    const response = await api.put<Role>(`/roles/${roleId}`, {
      role_name: roleName,
    });
    return response.data;
  },

  // ─── Delete Role ────────────────────────────────────────
  // DELETE /api/roles/:role_id
  // Cascades to role_permissions and user_roles
  //
  async deleteRole(roleId: number): Promise<void> {
    await api.delete(`/roles/${roleId}`);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  3.2 — Role ↔ Permission Pivot
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ─── List Permissions of a Role ─────────────────────────
  // GET /api/roles/:role_id/permissions
  //
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const response = await api.get<Permission[]>(
      `/roles/${roleId}/permissions`
    );
    return response.data;
  },

  // ─── Assign Single Permission to Role ───────────────────
  // POST /api/roles/:role_id/permissions   body: { permission_id: 5 }
  //
  async assignPermission(roleId: number, permissionId: number): Promise<void> {
    await api.post(`/roles/${roleId}/permissions`, {
      permission_id: permissionId,
    });
  },

  // ─── Bulk Assign Permissions to Role ────────────────────
  // POST /api/roles/:role_id/permissions/bulk
  // body: { permission_ids: [1, 2, 3, 4] }
  //
  // Example:
  //   const result = await roleService.bulkAssignPermissions(1, [1,2,3]);
  //   console.log(result.added, result.skipped, result.not_found);
  //
  async bulkAssignPermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<BulkPermissionResult> {
    const response = await api.post<BulkPermissionResult>(
      `/roles/${roleId}/permissions/bulk`,
      { permission_ids: permissionIds }
    );
    return response.data;
  },

  // ─── Replace All Permissions for Role ───────────────────
  // PUT /api/roles/:role_id/permissions
  // body: { permission_ids: [1, 2, 3] }
  //
  async replacePermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<void> {
    await api.put(`/roles/${roleId}/permissions`, {
      permission_ids: permissionIds,
    });
  },

  // ─── Remove Permission from Role ────────────────────────
  // DELETE /api/roles/:role_id/permissions/:permission_id
  //
  async removePermission(
    roleId: number,
    permissionId: number
  ): Promise<void> {
    await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  3.3 — User ↔ Role Pivot (via /api/roles/users)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ─── List Roles for a User ──────────────────────────────
  // GET /api/roles/users/:user_id
  //
  async getUserRoles(userId: number): Promise<Role[]> {
    const response = await api.get<Role[]>(`/roles/users/${userId}`);
    return response.data;
  },

  // ─── Assign Role to User ───────────────────────────────
  // POST /api/roles/users/:user_id   body: { role_id: 1 }
  //
  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await api.post(`/roles/users/${userId}`, { role_id: roleId });
  },

  // ─── Bulk Assign Roles to User ─────────────────────────
  // POST /api/roles/users/:user_id/bulk
  // body: { role_ids: [1, 2, 3] }
  //
  async bulkAssignRolesToUser(
    userId: number,
    roleIds: number[]
  ): Promise<BulkRoleResult> {
    const response = await api.post<BulkRoleResult>(
      `/roles/users/${userId}/bulk`,
      { role_ids: roleIds }
    );
    return response.data;
  },

  // ─── Remove Role from User ─────────────────────────────
  // DELETE /api/roles/users/:user_id/:role_id
  //
  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await api.delete(`/roles/users/${userId}/${roleId}`);
  },
};

export default roleService;
