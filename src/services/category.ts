// ============================================================
// Category Service — /api/categories
// Mixed: public (GET) + 🔒 Auth for mutations
// ============================================================

import api from './api';
import type { Category } from '@/types';

export const categoryService = {
  // ─── List Categories ────────────────────────────────────
  // GET /api/categories?include_count=true — Public
  //
  // Example:
  //   const categories = await categoryService.getCategories(true);
  //   categories.forEach(c => console.log(c.category_name, c.product_count));
  //
  async getCategories(includeCount = false): Promise<Category[]> {
    const qs = includeCount ? '?include_count=true' : '';
    const response = await api.get<Category[]>(`/categories${qs}`);
    // Defensive: ensure we always return an array
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray((data as any)?.items)) return (data as any).items;
    if (Array.isArray((data as any)?.data)) return (data as any).data;
    console.warn('[CategoryService] getCategories: unexpected response shape', data);
    return [];
  },

  // ─── Get Category by ID ─────────────────────────────────
  // GET /api/categories/:id — Public (includes product count)
  //
  async getCategory(id: number | string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // ─── Create Category ────────────────────────────────────
  // POST /api/categories — 🔒 Auth
  // body: { category_name: "Electronics" }
  //
  async createCategory(categoryName: string): Promise<Category> {
    const response = await api.post<Category>('/categories', {
      category_name: categoryName,
    });
    return response.data;
  },

  // ─── Update Category ────────────────────────────────────
  // PUT /api/categories/:id — 🔒 Auth
  // body: { category_name: "Updated Name" }
  //
  async updateCategory(
    id: number | string,
    categoryName: string
  ): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, {
      category_name: categoryName,
    });
    return response.data;
  },

  // ─── Delete Category ────────────────────────────────────
  // DELETE /api/categories/:id — 🔒 Auth
  // Fails if products exist in this category.
  //
  async deleteCategory(id: number | string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
