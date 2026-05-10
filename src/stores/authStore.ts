// ============================================================
// Auth Store — Zustand + Persist
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RegisterData } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import authService from '@/services/auth';
import { ApiError } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      validationErrors: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null, validationErrors: null });

        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          // Fetch complete user data (with roles/permissions) in background
          get().fetchUser();
        } catch (error) {
          if (error instanceof ApiError) {
            set({
              error: error.message,
              validationErrors: error.errors ?? null,
              isLoading: false,
            });
          } else {
            set({
              error: 'Login failed. Please try again.',
              isLoading: false,
            });
          }
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null, validationErrors: null });

        try {
          const response = await authService.register(data);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          // Fetch complete user data in background
          get().fetchUser();
        } catch (error) {
          if (error instanceof ApiError) {
            set({
              error: error.message,
              validationErrors: error.errors ?? null,
              isLoading: false,
            });
          } else {
            set({
              error: 'Registration failed. Please try again.',
              isLoading: false,
            });
          }
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            validationErrors: null,
          });
        }
      },

      fetchUser: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch {
          // Token is invalid — clear auth state
          localStorage.removeItem(STORAGE_KEYS.accessToken);
          localStorage.removeItem(STORAGE_KEYS.refreshToken);
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      /**
       * Called once on app mount by AuthWrapper.
       * Validates the stored token against the backend and fetches
       * fresh user data including roles and permissions.
       */
      initAuth: async () => {
        if (get().isInitialized) return;

        const token = localStorage.getItem(STORAGE_KEYS.accessToken);
        if (token) {
          try {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true, isInitialized: true });
          } catch {
            // Token expired or invalid — clear everything
            localStorage.removeItem(STORAGE_KEYS.accessToken);
            localStorage.removeItem(STORAGE_KEYS.refreshToken);
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } else {
          // No token — not authenticated
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },

      updateUser: (userData) => {
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...userData };
          return { user: updated };
        });
      },

      clearError: () => set({ error: null, validationErrors: null }),
    }),
    {
      // Use a dedicated key to avoid conflict with auth.ts localStorage writes
      name: 'torida_auth_store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
