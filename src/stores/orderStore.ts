import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, CheckoutData, UserDashboardStats } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import orderService from '@/services/order';
import { ApiError } from '@/services/api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  dashboardStats: UserDashboardStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (checkoutData: CheckoutData) => Promise<Order>;
  cancelOrder: (orderId: number) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      dashboardStats: null,
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true });

        try {
          const result = await orderService.getOrders();
          set({
            orders: result.items || [],
            isLoading: false,
          });
        } catch {
          set({
            orders: [],
            isLoading: false,
          });
        }
      },

      fetchOrderById: async (id: number) => {
        set({ isLoading: true });

        try {
          const order = await orderService.getOrder(id);
          set({
            currentOrder: order,
            isLoading: false,
          });
        } catch {
          set({
            currentOrder: null,
            isLoading: false,
          });
        }
      },

      createOrder: async (checkoutData: CheckoutData) => {
        set({ isLoading: true, error: null });

        try {
          const newOrder = await orderService.createOrder(checkoutData);

          set(state => ({
            orders: [newOrder, ...state.orders],
            currentOrder: newOrder,
            isLoading: false,
          }));

          return newOrder;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to create order';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      cancelOrder: async (orderId: number) => {
        set({ isLoading: true, error: null });

        try {
          await orderService.cancelOrder(orderId);

          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId
                ? { ...order, status: 'cancelled' as OrderStatus, updated_at: new Date().toISOString() }
                : order
            ),
            currentOrder: state.currentOrder?.id === orderId
              ? { ...state.currentOrder, status: 'cancelled' as OrderStatus }
              : state.currentOrder,
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to cancel order';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      fetchDashboardStats: async () => {
        set({ isLoading: true });

        try {
          // Build stats from orders list
          const result = await orderService.getOrders();
          const orders = result.items || [];

          const stats: UserDashboardStats = {
            total_orders: orders.length,
            pending_orders: orders.filter(o => o.status === 'pending').length,
            total_spent: orders.reduce((sum, o) => sum + o.total_amount, 0),
            wishlist_count: 0,
            cart_items: 0,
          };

          set({
            dashboardStats: stats,
            isLoading: false,
          });
        } catch {
          set({
            dashboardStats: null,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.orders || 'torida_orders',
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);

export default useOrderStore;
