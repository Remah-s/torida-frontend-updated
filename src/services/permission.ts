// ============================================================
// Permission Service — /api/permissions
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type {
  Permission,
  PaginatedData,
  BulkPermissionCreateResult,
} from '@/types';

export const permissionService = {
  // ─── List Permissions (paginated) ───────────────────────
  // GET /api/permissions?page=1&per_page=20
  //
  // Example:
  //   const result = await permissionService.getPermissions();
  //   result.items.forEach(p => console.log(p.permission_name));
  //
  async getPermissions(
    page = 1,
    perPage = 100
  ): Promise<PaginatedData<Permission>> {
    return await api.getPaginated<Permission>(
      `/permissions?page=${page}&per_page=${perPage}`
    );
  },

  // ─── Get Single Permission ──────────────────────────────
  // GET /api/permissions/:permission_id
  //
  async getPermission(permissionId: number): Promise<Permission> {
    const response = await api.get<Permission>(
      `/permissions/${permissionId}`
    );
    return response.data;
  },

  // ─── Create Permission ──────────────────────────────────
  // POST /api/permissions   body: { permission_name: "invoices:read" }
  //
  // Note: must follow "resource:action" format.
  //
  // Example:
  //   const perm = await permissionService.createPermission('invoices:read');
  //
  async createPermission(permissionName: string): Promise<Permission> {
    const response = await api.post<Permission>('/permissions', {
      permission_name: permissionName,
    });
    return response.data;
  },

  // ─── Bulk Create Permissions ────────────────────────────
  // POST /api/permissions/bulk
  // body: { permission_names: ["invoices:read", "invoices:write"] }
  //
  // Example:
  //   const result = await permissionService.bulkCreatePermissions([
  //     'invoices:read', 'invoices:write', 'invoices:delete',
  //   ]);
  //   console.log(result.created, result.skipped, result.errors);
  //
  async bulkCreatePermissions(
    permissionNames: string[]
  ): Promise<BulkPermissionCreateResult> {
    const response = await api.post<BulkPermissionCreateResult>(
      '/permissions/bulk',
      { permission_names: permissionNames }
    );
    return response.data;
  },

  // ─── Update Permission ──────────────────────────────────
  // PUT /api/permissions/:permission_id
  // body: { permission_name: "invoices:manage" }
  //
  async updatePermission(
    permissionId: number,
    permissionName: string
  ): Promise<Permission> {
    const response = await api.put<Permission>(
      `/permissions/${permissionId}`,
      { permission_name: permissionName }
    );
    return response.data;
  },

  // ─── Delete Permission ──────────────────────────────────
  // DELETE /api/permissions/:permission_id
  // Cascades to role_permissions
  //
  async deletePermission(permissionId: number): Promise<void> {
    await api.delete(`/permissions/${permissionId}`);
  },
};

export default permissionService;
