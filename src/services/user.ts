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
