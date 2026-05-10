// ============================================================
// TORIDA B2B Marketplace — TypeScript Type Definitions
// Aligned with backend API v1.0.0
// ============================================================

// ─── API Response Types ──────────────────────────────────────

/** Standard API success response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** API error response */
export interface ApiErrorResponse {
  success: false;
  error?: string;
  message: string;
  code?: string;
  errors?: Record<string, string[]>; // Validation errors (422)
}

/** Paginated data envelope returned inside `data` */
export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Legacy alias kept for backward-compat with existing components
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
}

// ─── Authentication ──────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  type_id: number;   // 1=Supplier, 2=Retailer, 3=Company
  gov_id: number;    // Governorate ID
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  new_password: string;
}

// ─── Users ───────────────────────────────────────────────────

export interface User {
  id: number;
  custom_id: string;
  full_name: string;
  phone: string;
  email: string;
  type_id: number;
  gov_id: number;
  is_active: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
  roles?: Role[];
  business_profile?: BusinessProfile;
  user_type?: UserType;
  governorate?: Governorate;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  phone?: string;
  gov_id?: number;
  is_active?: boolean;
}

export interface UserFilters {
  page?: number;
  per_page?: number;
  type_id?: number;
  gov_id?: number;
  is_active?: string;
  search?: string;
}

// ─── Roles & Permissions ─────────────────────────────────────

export interface Role {
  id: number;
  custom_id: string;
  role_name: string;
  created_at: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  permission_name: string; // format: "resource:action"
}

export interface BulkPermissionResult {
  added: number[];
  skipped: number[];
  not_found: number[];
}

export interface BulkRoleResult {
  added: number[];
  skipped: number[];
  not_found: number[];
}

export interface BulkPermissionCreateResult {
  created: string[];
  skipped: string[];
  errors: string[];
}

// ─── Governorates ────────────────────────────────────────────

export interface Governorate {
  id: number;
  gov_name: string;
}

// ─── User Types ──────────────────────────────────────────────

export interface UserType {
  id: number;
  type_name: string;
  can_sell: boolean;
  can_buy: boolean;
}

// ─── Business Profiles ──────────────────────────────────────

export interface BusinessProfile {
  id?: number;
  user_id?: number;
  business_name: string;
  address?: string;
  tax_number?: string;
  commercial_register?: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  is_approved?: boolean;
  rating?: number;
  total_reviews?: number;
  total_products?: number;
  created_at?: string;
}

export interface CreateBusinessProfileData {
  business_name: string;
  address?: string;
  tax_number?: string;
  commercial_register?: string;
}

// ─── Categories ──────────────────────────────────────────────

export interface Category {
  id: number;
  category_name: string;
  custom_id?: string;
  product_count?: number;
  is_active?: boolean;
  created_at?: string;
}

// ─── Products ────────────────────────────────────────────────

export interface Product {
  id: number;
  custom_id?: string;
  category_id: number;
  company_id?: number;
  product_name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  images?: ProductImage[];
  category?: Category;
  seller?: User;
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  // Legacy compat fields
  minimum_order_quantity?: number;
  unit?: string;
  code?: string;
  name?: string;
  wholesale_price?: number;
  is_featured?: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
}

export interface CreateProductData {
  category_id: number;
  product_name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  is_active?: boolean;
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  category_id?: number;
  company_id?: number;
  min_price?: number;
  max_price?: number;
  is_active?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ─── Cart ────────────────────────────────────────────────────

export interface Cart {
  id?: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ─── Wishlist ────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  product_id: number;
  product?: Product;
  created_at?: string;
}

// ─── Orders ──────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  custom_id?: string;
  buyer_id?: number;
  seller_id?: number;
  address_id?: number;
  status: OrderStatus;
  total_amount: number;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
  buyer?: User;
  seller?: User;
  delivery_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: OrderStatus;
  note?: string;
  created_at: string;
}

export interface OrderFilters {
  page?: number;
  per_page?: number;
  status?: OrderStatus;
}

export interface CreateOrderData {
  address_id?: number;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  note?: string;
}

// ─── Payments ────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash_on_delivery';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePaymentData {
  order_id: number;
  method: PaymentMethod;
}

// ─── Reviews ─────────────────────────────────────────────────

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;      // 1–5
  comment?: string;
  user?: User;
  product?: Product;
  created_at?: string;
  updated_at?: string;
}

export interface CreateReviewData {
  product_id: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

// ─── Notifications ───────────────────────────────────────────

export interface Notification {
  id: number;
  type?: string;
  title?: string;
  message: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

// ─── Addresses ───────────────────────────────────────────────

export interface Address {
  id: number;
  user_id?: number;
  label: string;
  full_address: string;
  gov_id: number;
  city?: string;
  postal_code?: string;
  is_default: boolean;
  governorate?: Governorate;
  created_at?: string;
}

export interface CreateAddressData {
  label: string;
  full_address: string;
  gov_id: number;
  city?: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface UpdateAddressData {
  label?: string;
  full_address?: string;
  gov_id?: number;
  city?: string;
  postal_code?: string;
  is_default?: boolean;
}

// ─── Dashboard Stats (legacy compat) ────────────────────────

export interface UserDashboardStats {
  total_orders: number;
  pending_orders: number;
  total_spent: number;
  wishlist_count: number;
  cart_items: number;
}

export interface SupplierDashboardStats {
  total_products: number;
  active_products: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  monthly_revenue: number;
  total_customers: number;
  average_rating: number;
}

// ─── Misc (legacy compat) ────────────────────────────────────

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CheckoutData {
  address_id?: number;
}

export interface Supplier {
  id: number;
  user: User;
  business_name: string;
  logo_url?: string;
  cover_image_url?: string;
  description?: string;
  address?: string;
  governorate?: Governorate;
  rating: number;
  total_reviews: number;
  total_products: number;
  total_orders: number;
  is_verified: boolean;
  is_approved: boolean;
  joined_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// ─── Wishlist (legacy compat) ────────────────────────────────

export interface Wishlist {
  id: number;
  items: WishlistItem[];
  total_items: number;
}
