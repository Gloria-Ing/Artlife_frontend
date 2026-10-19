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

export type GalleryCategory = 'children' | 'abstract' | 'figurative' | 'heritage';

export type GalleryStatus = 'Available' | 'Private Collection' | 'Exhibition Feature';

export interface GalleryProductCreate {
  title: string;
  series: string;
  category: GalleryCategory;
  year: string;
  medium: string;
  dimensions: string;
  status: GalleryStatus;
  story: string;
  colors: string[];
}

export interface GalleryProductResponse extends GalleryProductCreate {
  id: string | number;
  created_at?: string | null;
  updated_at?: string | null;
}
