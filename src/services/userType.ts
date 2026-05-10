// ============================================================
// User Type Service — /api/user-types
// Mixed: public (GET) + 🔒 Auth for mutations
// ============================================================

import api from './api';
import type { UserType } from '@/types';

export const userTypeService = {
  // ─── List All User Types ────────────────────────────────
  // GET /api/user-types — Public
  //
  // Example:
  //   const types = await userTypeService.getUserTypes();
  //   // [{ id: 1, type_name: "Supplier", can_sell: true, can_buy: false }, ...]
  //
  async getUserTypes(): Promise<UserType[]> {
    const response = await api.get<UserType[]>('/user-types');
    return response.data;
  },

  // ─── Get User Type by ID ────────────────────────────────
  // GET /api/user-types/:id — Public
  //
  async getUserType(id: number): Promise<UserType> {
    const response = await api.get<UserType>(`/user-types/${id}`);
    return response.data;
  },

  // ─── Create User Type ───────────────────────────────────
  // POST /api/user-types — 🔒 Auth
  // body: { type_name: "Distributor", can_sell: true, can_buy: true }
  //
  async createUserType(data: {
    type_name: string;
    can_sell: boolean;
    can_buy: boolean;
  }): Promise<UserType> {
    const response = await api.post<UserType>('/user-types', data);
    return response.data;
  },

  // ─── Update User Type ───────────────────────────────────
  // PUT /api/user-types/:id — 🔒 Auth
  //
  async updateUserType(
    id: number,
    data: Partial<{ type_name: string; can_sell: boolean; can_buy: boolean }>
  ): Promise<UserType> {
    const response = await api.put<UserType>(`/user-types/${id}`, data);
    return response.data;
  },

  // ─── Delete User Type ───────────────────────────────────
  // DELETE /api/user-types/:id — 🔒 Auth
  // Fails if users exist with this type.
  //
  async deleteUserType(id: number): Promise<void> {
    await api.delete(`/user-types/${id}`);
  },
};

export default userTypeService;
