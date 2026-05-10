import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, WishlistItem } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import wishlistService from '@/services/wishlist';
import { ApiError } from '@/services/api';

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        set({ isLoading: true });

        try {
          const result = await wishlistService.getWishlist();
          const items = result.items || result || [];
          set({
            items: Array.isArray(items) ? items : [],
            totalItems: Array.isArray(items) ? items.length : 0,
            isLoading: false,
          });
        } catch {
          set({
            items: [],
            totalItems: 0,
            isLoading: false,
          });
        }
      },

      addToWishlist: async (product: Product) => {
        set({ isLoading: true, error: null });

        try {
          const exists = get().items.some(item => item.product_id === product.id || item.product?.id === product.id);
          if (exists) {
            set({ isLoading: false });
            return;
          }

          await wishlistService.addProduct(product.id);

          const newItem: WishlistItem = {
            id: Date.now(),
            product_id: product.id,
            product,
          };

          set(state => ({
            items: [...state.items, newItem],
            totalItems: state.totalItems + 1,
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to add to wishlist';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      removeFromWishlist: async (productId: number) => {
        set({ isLoading: true, error: null });

        try {
          await wishlistService.removeProduct(productId);

          set(state => ({
            items: state.items.filter(item => item.product_id !== productId && item.product?.id !== productId),
            totalItems: Math.max(0, state.totalItems - 1),
            isLoading: false,
          }));
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Failed to remove from wishlist';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.some(item => item.product_id === productId || item.product?.id === productId);
      },

      clearWishlist: async () => {
        set({ isLoading: true });

        try {
          // Remove all items one by one (no bulk clear endpoint)
          const items = get().items;
          for (const item of items) {
            await wishlistService.removeProduct(item.product_id);
          }
          set({
            items: [],
            totalItems: 0,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.wishlist,
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
      }),
    }
  )
);

export default useWishlistStore;
