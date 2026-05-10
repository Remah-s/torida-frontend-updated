// ============================================================
// Admin Service — /api/admin
// All admin-facing API calls using the correct admin routes
// 🔒 All endpoints require Auth + Admin permissions
// ============================================================

import api from './api';
import type {
  User,
  Product,
  Order,
  Category,
  Role,
  Permission,
  UserType,
  Governorate,
  PaginatedData,
  UpdateOrderStatusData,
  Payment,
  Review,
} from '@/types';

// Helper to extract pagination data
const extractPagination = (data: any): PaginatedData<any> => {
  if (data.items && data.pagination) {
    return data;
  }
  // Handle legacy format
  return {
    items: data.items || data.data || [],
    pagination: {
      page: data.page || 1,
      per_page: data.per_page || 20,
      total_items: data.total || 0,
      total_pages: data.pages || 1,
      has_next: data.has_next || false,
      has_prev: data.has_prev || false,
    },
  };
};

export const adminService = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Dashboard & Analytics
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getDashboardStats(): Promise<any> {
    const response = await api.get<any>('/admin/dashboard');
    return response.data;
  },

  async getAnalytics(days: number = 30): Promise<any> {
    const response = await api.get<any>(`/admin/analytics?days=${days}`);
    return response.data;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Users
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getUsers(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<PaginatedData<User>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    const response = await api.get<PaginatedData<User>>(
      `/admin/users${qs ? `?${qs}` : ''}`
    );
    return extractPagination(response.data);
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  async updateUser(
    id: number,
    data: Record<string, unknown>
  ): Promise<User> {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async toggleUserActive(id: number): Promise<User> {
    const response = await api.post<User>(`/admin/users/${id}/toggle-active`);
    return response.data;
  },

  async assignRole(userId: number, roleId: number): Promise<void> {
    await api.post(`/admin/users/${userId}/roles`, { role_id: roleId });
  },

  async removeRole(userId: number, roleId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}/roles/${roleId}`);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Products
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getProducts(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<PaginatedData<Product>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    const response = await api.get<PaginatedData<Product>>(
      `/admin/products${qs ? `?${qs}` : ''}`
    );
    return extractPagination(response.data);
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`/admin/products/${id}`);
    return response.data;
  },

  async updateProduct(
    id: number,
    data: Record<string, unknown>
  ): Promise<Product> {
    const response = await api.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  },

  async toggleProductActive(id: number): Promise<Product> {
    const response = await api.post<Product>(`/admin/products/${id}/toggle-active`);
    return response.data;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Orders
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getOrders(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<PaginatedData<Order>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    const response = await api.get<PaginatedData<Order>>(
      `/admin/orders${qs ? `?${qs}` : ''}`
    );
    return extractPagination(response.data);
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<Order>(`/admin/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatusData
  ): Promise<Order> {
    const response = await api.put<Order>(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Categories
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/admin/categories');
    return response.data;
  },

  async createCategory(data: { category_name: string }): Promise<Category> {
    const response = await api.post<Category>('/admin/categories', data);
    return response.data;
  },

  async updateCategory(
    id: number,
    data: { category_name: string }
  ): Promise<Category> {
    const response = await api.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Payments
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getPayments(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<PaginatedData<Payment>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    const response = await api.get<PaginatedData<Payment>>(
      `/admin/payments${qs ? `?${qs}` : ''}`
    );
    return extractPagination(response.data);
  },

  async updatePaymentStatus(
    id: number,
    status: string,
    transactionId?: string
  ): Promise<Payment> {
    const response = await api.put<Payment>(`/admin/payments/${id}/status`, {
      status,
      transaction_id: transactionId,
    });
    return response.data;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Reviews
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getReviews(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<PaginatedData<Review>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    const response = await api.get<PaginatedData<Review>>(
      `/admin/reviews${qs ? `?${qs}` : ''}`
    );
    return extractPagination(response.data);
  },

  async deleteReview(id: number): Promise<void> {
    await api.delete(`/admin/reviews/${id}`);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Roles & Permissions (via admin routes)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/admin/roles');
    return response.data;
  },

  async getPermissions(): Promise<Permission[]> {
    const response = await api.get<Permission[]>('/admin/permissions');
    return response.data;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Lookups
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async getUserTypes(): Promise<UserType[]> {
    const response = await api.get<UserType[]>('/admin/user-types');
    return response.data;
  },

  async getGovernorates(): Promise<Governorate[]> {
    const response = await api.get<Governorate[]>('/admin/governorates');
    return response.data;
  },
};

export default adminService;
