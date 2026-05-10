// ============================================================
// Governorate Service — /api/governorates
// Mixed: public (GET) + 🔒 Auth for mutations
// ============================================================

import api from './api';
import type { Governorate } from '@/types';

export const governorateService = {
  // ─── List All Governorates ──────────────────────────────
  // GET /api/governorates — Public
  //
  // Example:
  //   const govs = await governorateService.getGovernorates();
  //   govs.forEach(g => console.log(g.gov_name));
  //
  async getGovernorates(): Promise<Governorate[]> {
    const response = await api.get<Governorate[]>('/governorates');
    return response.data;
  },

  // ─── Get Governorate by ID ──────────────────────────────
  // GET /api/governorates/:id — Public
  //
  async getGovernorate(id: number): Promise<Governorate> {
    const response = await api.get<Governorate>(`/governorates/${id}`);
    return response.data;
  },

  // ─── Create Governorate ─────────────────────────────────
  // POST /api/governorates — 🔒 Auth
  // body: { gov_name: "New Gov" }
  //
  async createGovernorate(govName: string): Promise<Governorate> {
    const response = await api.post<Governorate>('/governorates', {
      gov_name: govName,
    });
    return response.data;
  },

  // ─── Update Governorate ─────────────────────────────────
  // PUT /api/governorates/:id — 🔒 Auth
  //
  async updateGovernorate(
    id: number,
    govName: string
  ): Promise<Governorate> {
    const response = await api.put<Governorate>(`/governorates/${id}`, {
      gov_name: govName,
    });
    return response.data;
  },

  // ─── Delete Governorate ─────────────────────────────────
  // DELETE /api/governorates/:id — 🔒 Auth
  // Fails if users exist in this governorate.
  //
  async deleteGovernorate(id: number): Promise<void> {
    await api.delete(`/governorates/${id}`);
  },
};

export default governorateService;
