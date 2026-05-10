// ============================================================
// Review Service — /api/reviews
// Mixed: public (GET product reviews) + 🔒 Auth for mutations
// ============================================================

import api from './api';
import type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  PaginatedData,
} from '@/types';

export const reviewService = {
  // ─── Get Reviews for a Product (paginated) ──────────────
  // GET /api/reviews/product/:product_id — Public
  //
  // Example:
  //   const result = await reviewService.getProductReviews(5, 1, 10);
  //   result.items.forEach(r => console.log(r.rating, r.comment));
  //
  async getProductReviews(
    productId: number,
    page = 1,
    perPage = 20
  ): Promise<PaginatedData<Review>> {
    return await api.getPaginated<Review>(
      `/reviews/product/${productId}?page=${page}&per_page=${perPage}`
    );
  },

  // ─── Create Review ──────────────────────────────────────
  // POST /api/reviews — 🔒 Auth
  // One review per user per product.
  //
  // Example:
  //   await reviewService.createReview({
  //     product_id: 1, rating: 5, comment: 'Excellent!'
  //   });
  //
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  // ─── Update Review ──────────────────────────────────────
  // PUT /api/reviews/:id — 🔒 Author only
  //
  async updateReview(
    id: number,
    data: UpdateReviewData
  ): Promise<Review> {
    const response = await api.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  // ─── Delete Review ──────────────────────────────────────
  // DELETE /api/reviews/:id — 🔒 Author only
  //
  async deleteReview(id: number): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },

  // ─── Get My Reviews (paginated) ─────────────────────────
  // GET /api/reviews/my-reviews — 🔒 Auth
  //
  async getMyReviews(
    page = 1,
    perPage = 20
  ): Promise<PaginatedData<Review>> {
    return await api.getPaginated<Review>(
      `/reviews/my-reviews?page=${page}&per_page=${perPage}`
    );
  },
};

export default reviewService;
