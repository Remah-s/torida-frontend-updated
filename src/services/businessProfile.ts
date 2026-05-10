// ============================================================
// Business Profile Service — /api/business-profiles
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type {
  BusinessProfile,
  CreateBusinessProfileData,
  PaginatedData,
} from '@/types';

export const businessProfileService = {
  // ─── List Business Profiles (paginated) ─────────────────
  // GET /api/business-profiles
  //
  async getProfiles(
    page = 1,
    perPage = 20
  ): Promise<PaginatedData<BusinessProfile>> {
    return await api.getPaginated<BusinessProfile>(
      `/business-profiles?page=${page}&per_page=${perPage}`
    );
  },

  // ─── Get Business Profile by User ID ────────────────────
  // GET /api/business-profiles/:user_id
  //
  async getProfile(userId: number): Promise<BusinessProfile> {
    const response = await api.get<BusinessProfile>(
      `/business-profiles/${userId}`
    );
    return response.data;
  },

  // ─── Create Business Profile ────────────────────────────
  // POST /api/business-profiles
  //
  // Example:
  //   await businessProfileService.createProfile({
  //     business_name: 'Tech Corp',
  //     address: '123 Main St, Cairo',
  //     tax_number: 'TAX-12345',
  //     commercial_register: 'CR-67890',
  //   });
  //
  async createProfile(
    data: CreateBusinessProfileData
  ): Promise<BusinessProfile> {
    const response = await api.post<BusinessProfile>(
      '/business-profiles',
      data
    );
    return response.data;
  },

  // ─── Update Business Profile ────────────────────────────
  // PUT /api/business-profiles/:user_id — Owner only
  //
  async updateProfile(
    userId: number,
    data: Partial<CreateBusinessProfileData>
  ): Promise<BusinessProfile> {
    const response = await api.put<BusinessProfile>(
      `/business-profiles/${userId}`,
      data
    );
    return response.data;
  },

  // ─── Delete Business Profile ────────────────────────────
  // DELETE /api/business-profiles/:user_id — Owner only
  //
  async deleteProfile(userId: number): Promise<void> {
    await api.delete(`/business-profiles/${userId}`);
  },
};

export default businessProfileService;
