// ============================================================
// Wishlist Service — /api/wishlist
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type { WishlistItem, PaginatedData } from '@/types';

export const wishlistService = {
  // ─── Get Wishlist (paginated) ───────────────────────────
  // GET /api/wishlist
  //
  async getWishlist(
    page = 1,
    perPage = 20
  ): Promise<PaginatedData<WishlistItem>> {
    return await api.getPaginated<WishlistItem>(
      `/wishlist?page=${page}&per_page=${perPage}`
    );
  },

  // ─── Add Product to Wishlist ────────────────────────────
  // POST /api/wishlist   body: { product_id: 1 }
  //
  async addProduct(productId: number): Promise<void> {
    await api.post('/wishlist', { product_id: productId });
  },

  // ─── Remove Product from Wishlist ──────────────────────
  // DELETE /api/wishlist/:product_id
  //
  async removeProduct(productId: number): Promise<void> {
    await api.delete(`/wishlist/${productId}`);
  },

  // ─── Check if Product is in Wishlist ───────────────────
  // GET /api/wishlist/check/:product_id
  // Returns { in_wishlist: true/false }
  //
  async checkProduct(
    productId: number
  ): Promise<{ in_wishlist: boolean }> {
    const response = await api.get<{ in_wishlist: boolean }>(
      `/wishlist/check/${productId}`
    );
    return response.data;
  },
};

export default wishlistService;
