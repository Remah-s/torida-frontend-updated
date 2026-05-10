import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import cartService from '@/services/cart';
import { ApiError } from '@/services/api';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true });
        
        try {
          const cart = await cartService.getCart();
          set({
            cart,
            items: cart.items,
            totalItems: cart.total_items,
            totalAmount: cart.total_amount,
            isLoading: false,
          });
        } catch {
          set({
            cart: null,
            items: [],
            totalItems: 0,
            totalAmount: 0,
            isLoading: false,
          });
        }
      },

      addToCart: async (product, quantity) => {
        set({ isLoading: true, error: null });
        
        try {
          const cart = await cartService.addItem(product.id, quantity);
          set({
            cart,
            items: cart.items,
            totalItems: cart.total_items,
            totalAmount: cart.total_amount,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to add item';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        
        try {
          const cart = await cartService.updateItemQuantity(itemId, quantity);
          set({
            cart,
            items: cart.items,
            totalItems: cart.total_items,
            totalAmount: cart.total_amount,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to update quantity';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        
        try {
          await cartService.removeItem(itemId);
          // Re-fetch cart after removal
          const cart = await cartService.getCart();
          set({
            cart,
            items: cart.items,
            totalItems: cart.total_items,
            totalAmount: cart.total_amount,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to remove item';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        
        try {
          await cartService.clearCart();
          set({
            cart: null,
            items: [],
            totalItems: 0,
            totalAmount: 0,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      applyCoupon: async () => {
        set({ error: 'Coupon support is not available yet.' });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.cart,
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
      }),
    }
  )
);

export default useCartStore;
