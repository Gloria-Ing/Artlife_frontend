import axios, { type AxiosError } from 'axios';
import type {
  AccountCreate,
  AccountResponse,
  HealthResponse,
  LoginRequest,
  LoginResponse,
  RootResponse,
} from '../types/api';

const DEFAULT_BASE_URL = 'https://gogo.mababa.app';
const STORAGE_TOKEN_KEY = 'artlife_jwt_token';
const STORAGE_BASE_URL_KEY = 'artlife_api_base_url';

export const getStoredBaseUrl = (): string => {
  return localStorage.getItem(STORAGE_BASE_URL_KEY) || DEFAULT_BASE_URL;
};

export const setStoredBaseUrl = (url: string) => {
  localStorage.setItem(STORAGE_BASE_URL_KEY, url);
  apiClient.defaults.baseURL = url;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }
};

export const apiClient = axios.create({
  baseURL: getStoredBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach Bearer token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: unknown; message?: string }>;
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data;
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item) => `${item.loc?.slice(1).join('.') || 'field'}: ${item.msg}`)
          .join(', ');
      }
      if (data.message) {
        return data.message;
      }
    }
    if (axiosErr.response?.status === 401) {
      return 'Unauthorized: Invalid credentials or session expired.';
    }
    if (axiosErr.response?.status === 409) {
      return 'Conflict: Email, phone, or custom ID already exists.';
    }
    return axiosErr.message || 'An unknown network error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export const apiService = {
  // Check health and postgres connectivity
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  // Get root service information
  async getRoot(): Promise<RootResponse> {
    const response = await apiClient.get<RootResponse>('/');
    return response.data;
  },

  // Create account
  async register(data: AccountCreate): Promise<AccountResponse> {
    // If id is null or undefined or empty, omit it or pass null
    const payload: Partial<AccountCreate> = { ...data };
    if (!payload.id) {
      delete payload.id;
    } else {
      payload.id = Number(payload.id);
    }
    const response = await apiClient.post<AccountResponse>('/register', payload);
    return response.data;
  },

  // Log in
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/login', data);
    return response.data;
  },

  // Current authenticated user profile
  async getMe(): Promise<AccountResponse> {
    const response = await apiClient.get<AccountResponse>('/me');
    return response.data;
  },

  // List all registered accounts
  async getAccounts(skip = 0, limit = 100): Promise<AccountResponse[]> {
    const response = await apiClient.get<AccountResponse[]>('/accounts', {
      params: { skip, limit },
    });
    return response.data;
  },

  // Generic request runner for the interactive explorer
  async rawRequest(method: 'GET' | 'POST', endpoint: string, body?: unknown, params?: Record<string, unknown>) {
    const startTime = performance.now();
    try {
      const response = await apiClient({
        method,
        url: endpoint,
        data: body,
        params,
      });
      const durationMs = Math.round(performance.now() - startTime);
      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        durationMs,
        isError: false,
      };
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      if (axios.isAxiosError(err)) {
        return {
          status: err.response?.status || 500,
          statusText: err.response?.statusText || 'Error',
          headers: err.response?.headers || {},
          data: err.response?.data || { error: err.message },
          durationMs,
          isError: true,
        };
      }
      return {
        status: 500,
        statusText: 'Client Exception',
        headers: {},
        data: { error: String(err) },
        durationMs,
        isError: true,
      };
    }
  },
};
