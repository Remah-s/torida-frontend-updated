// ============================================================
// User Service — /api/users
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import { buildQueryString } from '@/utils';
import type {
  User,
  UpdateUserData,
  UserFilters,
  PaginatedData,
  Role,
  Address,
  BusinessProfile,
} from '@/types';

export const userService = {
  // ─── List Users (paginated + filtered) ───────────────────
  // GET /api/users?page=1&per_page=20&type_id=2&search=ahmed
  //
  // Example:
  //   const result = await userService.getUsers({ page: 1, search: 'Ahmed' });
  //   console.log(result.items, result.pagination);
  //
  async getUsers(filters?: UserFilters): Promise<PaginatedData<User>> {
    const qs = filters
      ? buildQueryString(filters as Record<string, string | number | boolean | undefined>)
      : '';
    return await api.getPaginated<User>(
      `/users${qs ? `?${qs}` : ''}`
    );
  },

  // ─── Get All Suppliers (Supplier + Company types) ────────
  // Fetches users with type_id=1 (Supplier) AND type_id=3 (Company)
  // in parallel, merges and deduplicates by ID.
  //
  async getSuppliers(perPage = 100): Promise<PaginatedData<User>> {
    // Fetch both seller user types in parallel
    const [suppliersResult, companiesResult] = await Promise.all([
      this.getUsers({ type_id: 1, per_page: perPage }).catch((err) => {
        console.warn('[UserService] Failed to fetch type_id=1 suppliers:', err);
        return { items: [] as User[], pagination: null } as any;
      }),
      this.getUsers({ type_id: 3, per_page: perPage }).catch((err) => {
        console.warn('[UserService] Failed to fetch type_id=3 companies:', err);
        return { items: [] as User[], pagination: null } as any;
      }),
    ]);

    const supplierItems = Array.isArray(suppliersResult?.items) ? suppliersResult.items : [];
    const companyItems = Array.isArray(companiesResult?.items) ? companiesResult.items : [];

    // Debug logging
    console.log(`[UserService] getSuppliers: type_id=1 returned ${supplierItems.length}, type_id=3 returned ${companyItems.length}`);

    // Merge and deduplicate by user ID
    const seen = new Set<number>();
    const merged: User[] = [];
    for (const user of [...supplierItems, ...companyItems]) {
      if (user?.id && !seen.has(user.id)) {
        seen.add(user.id);
        merged.push(user);
      }
    }

    console.log(`[UserService] getSuppliers: ${merged.length} unique suppliers after merge`);

    return {
      items: merged,
      pagination: {
        page: 1,
        per_page: merged.length,
        total_items: merged.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    };
  },

  // ─── Get User by ID ─────────────────────────────────────
  // GET /api/users/:user_id
  //
  async getUser(userId: number): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  // ─── Update User ────────────────────────────────────────
  // PUT /api/users/:user_id
  //
  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  // ─── Delete (Soft-delete / Deactivate) User ─────────────
  // DELETE /api/users/:user_id
  //
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  // ─── Get User Roles ─────────────────────────────────────
  // GET /api/users/:user_id/roles
  //
  async getUserRoles(userId: number): Promise<Role[]> {
    const response = await api.get<Role[]>(`/users/${userId}/roles`);
    return response.data;
  },

  // ─── Assign Role to User ────────────────────────────────
  // POST /api/users/:user_id/roles   body: { role_id: 1 }
  //
  // Example:
  //   await userService.assignRole(5, 2); // assign role 2 to user 5
  //
  async assignRole(userId: number, roleId: number): Promise<void> {
    await api.post(`/users/${userId}/roles`, { role_id: roleId });
  },

  // ─── Remove Role from User ──────────────────────────────
  // DELETE /api/users/:user_id/roles/:role_id
  //
  async removeRole(userId: number, roleId: number): Promise<void> {
    await api.delete(`/users/${userId}/roles/${roleId}`);
  },

  // ─── Get User Addresses ─────────────────────────────────
  // GET /api/users/:user_id/addresses
  //
  async getUserAddresses(userId: number): Promise<Address[]> {
    const response = await api.get<Address[]>(`/users/${userId}/addresses`);
    return response.data;
  },

  // ─── Get User Business Profile ──────────────────────────
  // GET /api/users/:user_id/business-profile
  //
  async getUserBusinessProfile(userId: number): Promise<BusinessProfile> {
    const response = await api.get<BusinessProfile>(
      `/users/${userId}/business-profile`
    );
    return response.data;
  },
};

export default userService;
