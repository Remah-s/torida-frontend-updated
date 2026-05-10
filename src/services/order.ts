// ============================================================
// Order Service — /api/orders
// 🔒 All endpoints require Auth
// ============================================================

import api from './api';
import { buildQueryString } from '@/utils';
import type {
  Order,
  OrderItem,
  OrderStatusHistory,
  OrderFilters,
  CreateOrderData,
  UpdateOrderStatusData,
  PaginatedData,
} from '@/types';

export const orderService = {
  // ─── List Orders (paginated) ────────────────────────────
  // GET /api/orders?page=1&per_page=20&status=pending
  // Buyers see their orders; sellers see orders for their products.
  //
  // Example:
  //   const result = await orderService.getOrders({ status: 'pending', page: 1 });
  //   result.items.forEach(o => console.log(o.status, o.total_amount));
  //
  async getOrders(filters?: OrderFilters): Promise<PaginatedData<Order>> {
    const qs = filters
      ? buildQueryString(filters as Record<string, string | number | boolean | undefined>)
      : '';
    return await api.getPaginated<Order>(
      `/orders${qs ? `?${qs}` : ''}`
    );
  },

  // ─── Get Single Order (with status history) ─────────────
  // GET /api/orders/:id — Buyer or Seller only
  //
  async getOrder(id: number | string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // ─── Create Order from Cart ─────────────────────────────
  // POST /api/orders — Retailers only
  // body: { address_id: 1 } (optional)
  //
  // Creates one order per seller. Validates stock, reduces quantities, clears cart.
  //
  // Example:
  //   const order = await orderService.createOrder({ address_id: 1 });
  //
  async createOrder(data?: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // ─── Update Order Status ────────────────────────────────
  // PUT /api/orders/:id
  // body: { status: "confirmed", notes: "Optional note" }
  //
  // Seller updates forward statuses; both can cancel.
  //
  async updateOrderStatus(
    id: number | string,
    data: UpdateOrderStatusData
  ): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  // ─── Delete Order ───────────────────────────────────────
  // DELETE /api/orders/:id
  //
  async deleteOrder(id: number | string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  // ─── Cancel Order ───────────────────────────────────────
  // POST /api/orders/:id/cancel — Restores stock
  //
  async cancelOrder(id: number | string): Promise<Order> {
    const response = await api.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  // ─── Get Order Items ────────────────────────────────────
  // GET /api/orders/:id/items
  //
  async getOrderItems(id: number | string): Promise<OrderItem[]> {
    const response = await api.get<OrderItem[]>(`/orders/${id}/items`);
    return response.data;
  },

  // ─── Get Order Status History ───────────────────────────
  // GET /api/orders/:id/history
  //
  async getOrderHistory(
    id: number | string
  ): Promise<OrderStatusHistory[]> {
    const response = await api.get<OrderStatusHistory[]>(
      `/orders/${id}/history`
    );
    return response.data;
  },
};

export default orderService;
