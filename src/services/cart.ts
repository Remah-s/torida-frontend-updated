// ============================================================
// Cart Service — /api/cart
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import type { Cart } from '@/types';

export const cartService = {
  // ─── Get Cart ───────────────────────────────────────────
  // GET /api/cart — returns items + totals
  //
  // Example:
  //   const cart = await cartService.getCart();
  //   console.log(cart.items, cart.total_amount);
  //
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  // ─── Add Item to Cart ──────────────────────────────────
  // POST /api/cart/items   body: { product_id: 1, quantity: 2 }
  //
  async addItem(productId: number, quantity: number): Promise<Cart> {
    const response = await api.post<Cart>('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  // ─── Update Item Quantity ──────────────────────────────
  // PUT /api/cart/items/:item_id   body: { quantity: 5 }
  //
  async updateItemQuantity(itemId: number, quantity: number): Promise<Cart> {
    const response = await api.put<Cart>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // ─── Remove Item from Cart ─────────────────────────────
  // DELETE /api/cart/items/:item_id
  //
  async removeItem(itemId: number): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  // ─── Clear Entire Cart ─────────────────────────────────
  // DELETE /api/cart
  //
  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};

export default cartService;
