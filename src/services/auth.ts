// ============================================================
// Auth Service — /api/auth
// ============================================================

import api from './api';
import { STORAGE_KEYS } from '@/constants';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ChangePasswordData,
  ResetPasswordData,
} from '@/types';

export const authService = {
  // ─── Login ───────────────────────────────────────────────
  // POST /api/auth/login — Public
  //
  // Example:
  //   const auth = await authService.login({ email: 'x@y.com', password: 'Pass1' });
  //   console.log(auth.user, auth.access_token);
  //
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    if (response.success) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem(STORAGE_KEYS.accessToken, access_token);
      localStorage.setItem(STORAGE_KEYS.refreshToken, refresh_token);
      // User data is persisted by Zustand store — no duplicate write here
    }

    return response.data;
  },

  // ─── Register ────────────────────────────────────────────
  // POST /api/auth/register — Public
  //
  // Example:
  //   const auth = await authService.register({
  //     full_name: 'Ahmed', phone: '201234567890',
  //     email: 'a@b.com', password: 'SecurePass1',
  //     type_id: 2, gov_id: 1,
  //   });
  //
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);

    if (response.success) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem(STORAGE_KEYS.accessToken, access_token);
      localStorage.setItem(STORAGE_KEYS.refreshToken, refresh_token);
      // User data is persisted by Zustand store — no duplicate write here
    }

    return response.data;
  },

  // ─── Logout ──────────────────────────────────────────────
  // POST /api/auth/logout — 🔒 Auth Required
  //
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore server errors on logout — always clear local state
    } finally {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  },

  // ─── Get Current User ────────────────────────────────────
  // GET /api/auth/me — 🔒 Auth Required
  //
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // ─── Verify Email with OTP ───────────────────────────────
  // POST /api/auth/verify-email — 🔒 Auth Required
  //
  async verifyOtp(email: string, otp: string): Promise<void> {
    await api.post('/auth/verify-otp', { email, otp });
  },

  // ─── Resend Verification OTP ─────────────────────────────
  // POST /api/auth/resend-otp — 🔒 Auth Required
  //
  async resendVerificationOtp(email: string): Promise<void> {
    await api.post('/auth/resend-otp', { email });
  },

  // ─── Forgot Password ────────────────────────────────────
  // POST /api/auth/forgot-password — Public
  //
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  // ─── Reset Password ─────────────────────────────────────
  // POST /api/auth/reset-password — Public
  //
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post('/auth/reset-password', data);
  },

  // ─── Change Password ────────────────────────────────────
  // POST /api/auth/change-password — 🔒 Auth Required
  //
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.post('/auth/change-password', data);
  },

  // ─── Helper: Check if authenticated ─────────────────────
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.accessToken);
  },

  // ─── Helper: Get stored user from localStorage ──────────
  getStoredUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  // ─── Helper: Get user permissions from stored user ──────
  getUserPermissions(): string[] {
    const user = this.getStoredUser();
    if (!user?.roles) return [];
    const permissions = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions?.forEach((perm) => {
        permissions.add(perm.permission_name);
      });
    });
    return Array.from(permissions);
  },

  // ─── Helper: Check if user has a specific permission ────
  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  },

  // ─── Helper: Check if user has any of the given permissions ─
  hasAnyPermission(permissions: string[]): boolean {
    const userPerms = this.getUserPermissions();
    return permissions.some((p) => userPerms.includes(p));
  },

  // ─── Helper: Check if user has ALL of the given permissions ─
  hasAllPermissions(permissions: string[]): boolean {
    const userPerms = this.getUserPermissions();
    return permissions.every((p) => userPerms.includes(p));
  },
};

export default authService;
