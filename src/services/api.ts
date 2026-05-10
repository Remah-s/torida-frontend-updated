// ============================================================
// TORIDA B2B Marketplace — Core API Service Layer
// Axios-based HTTP client with JWT auth, auto-refresh, and
// standardised error handling.
// ============================================================

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import type { ApiResponse, ApiErrorResponse } from '@/types';

// ─── Custom Error Class ──────────────────────────────────────

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>; // validation errors
  raw: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    errors?: Record<string, string[]>,
    raw?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.raw = raw;
  }

  /** True when the server returned field-level validation errors (HTTP 422) */
  get isValidationError(): boolean {
    return this.status === 422 && !!this.errors;
  }

  /** Return human-readable string of all validation errors */
  get validationSummary(): string {
    if (!this.errors) return this.message;
    return Object.entries(this.errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join('\n');
  }
}

// ─── API Service Singleton ───────────────────────────────────

class ApiService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  // ── Interceptors ─────────────────────────────────────────

  private setupInterceptors() {
    // ▸ REQUEST – attach Bearer token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.accessToken);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug logging (remove in production)
        if (import.meta.env.DEV) {
          const base = config.baseURL ?? API_CONFIG.baseURL;
          const url = config.url ?? '';
          console.log(`[API] ${config.method?.toUpperCase()} ${base}${url}`);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ▸ RESPONSE – handle 401 refresh & normalise errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // ── 401 → try refreshing the access token ──
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue parallel requests while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

          if (!refreshToken) {
            this.handleLogout();
            return Promise.reject(this.normaliseError(error));
          }

          try {
            const response = await axios.post(
              `${API_CONFIG.baseURL}/api/auth/refresh`,
              { refresh_token: refreshToken }
            );

            const { access_token, refresh_token: newRefresh } = response.data.data;

            localStorage.setItem(STORAGE_KEYS.accessToken, access_token);
            if (newRefresh) {
              localStorage.setItem(STORAGE_KEYS.refreshToken, newRefresh);
            }

            this.processQueue(access_token, null);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }

            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(null, refreshError as Error);
            this.handleLogout();
            return Promise.reject(this.normaliseError(error));
          } finally {
            this.isRefreshing = false;
          }
        }

        // ── All other errors → throw ApiError ──
        return Promise.reject(this.normaliseError(error));
      }
    );
  }

  // ── Queue helpers ────────────────────────────────────────

  private processQueue(token: string | null, error: Error | null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    // Also clear Zustand persist key to prevent stale auth rehydration
    localStorage.removeItem('torida_auth_store');
    window.location.href = '/login';
  }

  private normalizeUrl(url: string) {
    return url.startsWith('/api') ? url : `/api${url.startsWith('/') ? url : `/${url}`}`;
  }

  // ── Error Normalisation ──────────────────────────────────

  private normaliseError(error: AxiosError<ApiErrorResponse>): ApiError {
    if (error.response) {
      const { data, status } = error.response;
      let message = data?.message || data?.error || error.message || 'An unexpected error occurred';

      if (status === 401) {
        message = data?.message || 'Unauthorized access. Please login again.';
      } else if (status === 404) {
        message = data?.message || 'Requested resource not found.';
      } else if (status >= 500) {
        message = data?.message || 'Server error — please try again later.';
      }

      return new ApiError(message, status, data?.code, data?.errors, data);
    }

    if (error.request) {
      return new ApiError(
        'Network error — please check your connection',
        0,
        'NETWORK_ERROR'
      );
    }

    return new ApiError(error.message || 'Unknown error', 0);
  }

  // ── HTTP Methods ─────────────────────────────────────────
  // Each returns the *unwrapped* ApiResponse<T> so callers
  // can access `.success`, `.data`, `.message` directly.

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(this.normalizeUrl(url), config);
    return response.data;
  }

  async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<import('@/types').PaginatedData<T>> {
    const response = await this.instance.get(this.normalizeUrl(url), config);
    return {
      items: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(this.normalizeUrl(url), data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(this.normalizeUrl(url), data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(this.normalizeUrl(url), data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(this.normalizeUrl(url), config);
    return response.data;
  }

  // ── File Upload ──────────────────────────────────────────

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(this.normalizeUrl(url), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return response.data;
  }
}

// ── Export singleton ───────────────────────────────────────

export const api = new ApiService();
export default api;
