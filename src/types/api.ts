export interface AccountResponse {
  id: number;
  firstname: string;
  lastname: string;
  username?: string | null;
  phone: string;
  email: string;
  role: 'user' | 'admin' | string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AccountCreate {
  id?: number | null;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: AccountResponse;
}

export interface HealthResponse {
  status: string;
  database: string;
  dialect: string;
  [key: string]: unknown;
}

export interface RootResponse {
  [key: string]: unknown;
}

export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface ApiError {
  detail?: string | ValidationErrorItem[];
  message?: string;
}

// ── Cart ────────────────────────────────────────────────────────────────────

export interface CartItemResponse {
  id: number;
  cart_id: number;
  gallery_product_id: number;
  quantity: number;
  added_at: string;
  product_title: string;
  product_price: string;
  product_image_url: string | null;
  product_status: string;
}

export interface CartResponse {
  id: number;
  account_id: number;
  items: CartItemResponse[];
  total_items: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface CartItemAdd {
  gallery_product_id: number;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export type GalleryCategory = 'children' | 'abstract' | 'figurative' | 'heritage';

export type GalleryStatus = 'Available' | 'Private Collection' | 'Exhibition Feature';

export interface GalleryProductCreate {
  title: string;
  series: string;
  price: string;
  image_file: File | null;
  category: GalleryCategory;
  year: string;
  dimensions: string;
  status: GalleryStatus;
  story: string;
}

export interface GalleryProductResponse {
  id: string | number;
  price: string | number | null;
  image_url: string | null;
  title: string;
  series: string;
  category: GalleryCategory;
  year: string;
  dimensions: string;
  status: GalleryStatus;
  story: string;
  created_at?: string | null;
  updated_at?: string | null;
}
