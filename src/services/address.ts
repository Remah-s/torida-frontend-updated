// ============================================================
// Address Service — /api/addresses
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type { Address, CreateAddressData, UpdateAddressData } from '@/types';

export const addressService = {
  // ─── List Addresses ─────────────────────────────────────
  // GET /api/addresses — default address listed first
  //
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<Address[]>('/addresses');
    return response.data;
  },

  // ─── Get Address by ID ──────────────────────────────────
  // GET /api/addresses/:id — Owner only
  //
  async getAddress(id: number): Promise<Address> {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  // ─── Create Address ─────────────────────────────────────
  // POST /api/addresses
  // First address auto-becomes default.
  //
  // Example:
  //   await addressService.createAddress({
  //     label: 'Home',
  //     full_address: '123 Main St, Apt 4',
  //     gov_id: 1,
  //     city: 'Cairo',
  //     is_default: true,
  //   });
  //
  async createAddress(data: CreateAddressData): Promise<Address> {
    const response = await api.post<Address>('/addresses', data);
    return response.data;
  },

  // ─── Update Address ─────────────────────────────────────
  // PUT /api/addresses/:id — Owner only
  //
  async updateAddress(
    id: number,
    data: UpdateAddressData
  ): Promise<Address> {
    const response = await api.put<Address>(`/addresses/${id}`, data);
    return response.data;
  },

  // ─── Set Default Address ────────────────────────────────
  // POST /api/addresses/:id/set-default — Owner only
  //
  async setDefault(id: number): Promise<void> {
    await api.post(`/addresses/${id}/set-default`);
  },

  // ─── Delete Address ─────────────────────────────────────
  // DELETE /api/addresses/:id — Owner only
  // If deleted was default, next address becomes default.
  //
  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};

export default addressService;
