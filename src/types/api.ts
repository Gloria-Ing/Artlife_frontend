export interface AccountResponse {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AccountCreate {
  id?: number | null;
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username_or_phone?: string | null;
  username?: string | null;
  phone?: string | null;
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
