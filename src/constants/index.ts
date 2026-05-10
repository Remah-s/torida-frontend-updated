// ============================================================
// TORIDA B2B Marketplace — Constants & Configuration
// ============================================================

export const BASE_URL = 'https://torida-v2.vercel.app';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_CONFIG = {
  baseURL: import.meta.env.DEV ? '' : (rawApiBaseUrl || BASE_URL).replace(/\/+$/, ''),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  accessToken: 'torida_access_token',
  refreshToken: 'torida_refresh_token',
  user: 'torida_user',
  cart: 'torida_cart',
  wishlist: 'torida_wishlist',
  orders: 'torida_orders',
  theme: 'torida_theme',
  language: 'torida_language',
};

// Routes
export const ROUTES = {
  // Public
  home: '/',
  login: '/login',
  register: '/register',
  products: '/products',
  productDetail: (id: number | string) => `/products/${id}`,
  categories: '/categories',
  categoryDetail: (id: number | string) => `/categories/${id}`,
  suppliers: '/suppliers',
  supplierDetail: (id: number | string) => `/suppliers/${id}`,

  // Protected
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  orderDetail: (id: number | string) => `/orders/${id}`,
  profile: '/profile',
  settings: '/settings',
  addresses: '/addresses',
  wishlist: '/wishlist',
  notifications: '/notifications',

  // Supplier Only
  supplierDashboard: '/supplier/dashboard',
  supplierProducts: '/supplier/products',
  supplierOrders: '/supplier/orders',
  addProduct: '/supplier/products/add',
  editProduct: (id: number | string) => `/supplier/products/${id}/edit`,

  // Admin Only
  adminDashboard: '/admin',
  adminUsers: '/admin/users',
  adminProducts: '/admin/products',
  adminOrders: '/admin/orders',
  adminCategories: '/admin/categories',
  adminRoles: '/admin/roles',
  adminPayments: '/admin/payments',
  adminReviews: '/admin/reviews',
  adminSettings: '/admin/settings',
};

// Order Status Labels & Colors
export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'info' },
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'primary' },
  out_for_delivery: { label: 'Out for Delivery', color: 'primary' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

// Order Status Flow
export const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
] as const;

// User Types (matching backend seed data)
export const USER_TYPES = {
  1: { id: 1, label: 'Supplier', can_sell: true, can_buy: false },
  2: { id: 2, label: 'Retailer', can_sell: false, can_buy: true },
  3: { id: 3, label: 'Company', can_sell: true, can_buy: false },
} as const;

// Default Permissions (matching backend seed data)
export const DEFAULT_PERMISSIONS = [
  'users:create',
  'users:read',
  'users:write',
  'users:delete',
  'products:create',
  'products:read',
  'products:write',
  'products:delete',
  'orders:create',
  'orders:read',
  'orders:write',
  'orders:cancel',
  'roles:manage',
  'permissions:manage',
  'reports:read',
  'settings:manage',
] as const;

// Default Roles
export const DEFAULT_ROLES = ['Admin', 'Manager', 'Editor', 'Viewer'] as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
};

// Image Placeholders
export const PLACEHOLDER_IMAGES = {
  product: '/images/placeholder-product.png',
  category: '/images/placeholder-category.png',
  avatar: '/images/placeholder-avatar.png',
  banner: '/images/placeholder-banner.png',
};

// Currency
export const CURRENCY = {
  code: 'EGP',
  symbol: 'E£',
  name: 'Egyptian Pound',
};

// Date Format
export const DATE_FORMAT = {
  short: 'dd/MM/yyyy',
  long: 'dd MMMM yyyy',
  dateTime: 'dd/MM/yyyy HH:mm',
  time: 'HH:mm',
};

// API Error Codes
export const API_ERROR_CODES = {
  MISSING_BODY: 'Request body is empty',
  MISSING_FIELD: 'Required field missing',
  INVALID_FIELD: 'Field has wrong type/format',
  EMPTY_ARRAY: 'Array field is empty',
  ROLE_CREATE_FAILED: 'Role creation error',
  ROLE_UPDATE_FAILED: 'Role update error',
  ROLE_DELETE_FAILED: 'Role deletion error',
  ROLE_ASSIGN_FAILED: 'Role assignment error',
  ROLE_BULK_FAILED: 'Bulk role assignment error',
  ROLE_REMOVE_FAILED: 'Role removal error',
  PERM_CREATE_FAILED: 'Permission creation error',
  PERM_UPDATE_FAILED: 'Permission update error',
  PERM_DELETE_FAILED: 'Permission deletion error',
  PERM_ASSIGN_FAILED: 'Permission assignment error',
  PERM_BULK_FAILED: 'Bulk permission error',
  PERM_REPLACE_FAILED: 'Permission replace error',
  PERM_REMOVE_FAILED: 'Permission removal error',
  PERMISSION_DENIED: 'User lacks required permission',
} as const;
