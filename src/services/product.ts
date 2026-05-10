// ============================================================
// Product Service — /api/products
// Mixed: public (GET) + 🔒 Auth for mutations
// ============================================================

import api from './api';
import { buildQueryString } from '@/utils';
import type {
  Product,
  CreateProductData,
  ProductFilters,
  ProductImage,
  PaginatedData,
} from '@/types';

export const productService = {
  // ─── List Products (paginated + filtered) ───────────────
  // GET /api/products?page=1&category_id=1&search=widget&sort_by=price&sort_order=asc
  // Public (active only by default)
  //
  // Example:
  //   const result = await productService.getProducts({
  //     category_id: 1, min_price: 10, max_price: 100, search: 'widget',
  //   });
  //   console.log(result.items, result.pagination);
  //
  async getProducts(filters?: ProductFilters): Promise<PaginatedData<Product>> {
    const qs = filters
      ? buildQueryString(filters as Record<string, string | number | boolean | undefined>)
      : '';
    return await api.getPaginated<Product>(
      `/products${qs ? `?${qs}` : ''}`
    );
  },

  // ─── Get Single Product (with reviews) ──────────────────
  // GET /api/products/:id — Public
  //
  async getProduct(id: number | string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // ─── Create Product ─────────────────────────────────────
  // POST /api/products — 🔒 Suppliers & Companies only
  //
  // Example:
  //   const product = await productService.createProduct({
  //     category_id: 1, product_name: 'Widget Pro',
  //     description: 'High-quality', price: 29.99, stock_quantity: 100,
  //   });
  //
  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  // ─── Update Product ─────────────────────────────────────
  // PUT /api/products/:id — 🔒 Owner only
  //
  async updateProduct(
    id: number | string,
    data: Partial<CreateProductData>
  ): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  // ─── Delete Product ─────────────────────────────────────
  // DELETE /api/products/:id — 🔒 Owner only
  //
  async deleteProduct(id: number | string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // ─── Get My Products ────────────────────────────────────
  // GET /api/products/my-products — 🔒 Auth
  //
  async getMyProducts(filters?: ProductFilters): Promise<PaginatedData<Product>> {
    const qs = filters
      ? buildQueryString(filters as Record<string, string | number | boolean | undefined>)
      : '';
    return await api.getPaginated<Product>(
      `/products/my-products${qs ? `?${qs}` : ''}`
    );
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Product Images
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ─── List Product Images ────────────────────────────────
  // GET /api/products/:id/images — Public
  //
  async getProductImages(productId: number | string): Promise<ProductImage[]> {
    const response = await api.get<ProductImage[]>(
      `/products/${productId}/images`
    );
    return response.data;
  },

  // ─── Upload Product Image ──────────────────────────────
  // POST /api/products/:id/images — 🔒 Owner
  // Form-data: image (file), is_primary (bool)
  //
  async uploadProductImage(
    productId: number | string,
    file: File,
    isPrimary = false
  ): Promise<ProductImage> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('is_primary', String(isPrimary));

    const response = await api.upload<ProductImage>(
      `/products/${productId}/images`,
      formData
    );
    return response.data;
  },

  // ─── Delete Product Image ──────────────────────────────
  // DELETE /api/products/:product_id/images/:image_id — 🔒 Owner
  //
  async deleteProductImage(
    productId: number | string,
    imageId: number
  ): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },

  // ─── Set Primary Image ─────────────────────────────────
  // POST /api/products/:product_id/images/:image_id/set-primary — 🔒 Owner
  //
  async setPrimaryImage(
    productId: number | string,
    imageId: number
  ): Promise<void> {
    await api.post(`/products/${productId}/images/${imageId}/set-primary`);
  },
};

export default productService;
