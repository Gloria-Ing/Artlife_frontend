import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  AccountCreate,
  AccountResponse,
  HealthResponse,
  LoginRequest,
  LoginResponse,
} from '../types/api';
import {
  apiService,
  getStoredBaseUrl,
  getStoredToken,
  setStoredBaseUrl,
  setStoredToken,
  parseApiError,
} from '../services/api';

interface AuthContextType {
  user: AccountResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  health: HealthResponse | null;
  healthLatency: number | null;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: AccountCreate) => Promise<AccountResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  checkHealth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<AccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [baseUrl, setBaseUrlState] = useState<string>(getStoredBaseUrl());
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);

  const checkHealth = useCallback(async () => {
    const t0 = performance.now();
    try {
      const data = await apiService.getHealth();
      const latency = Math.round(performance.now() - t0);
      setHealth(data);
      setHealthLatency(latency);
    } catch {
      setHealth(null);
      setHealthLatency(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const profile = await apiService.getMe();
      setUser(profile);
    } catch {
      // Token expired or invalid
      setStoredToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    refreshUser();

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth, refreshUser]);

  const setBaseUrl = (url: string) => {
    setStoredBaseUrl(url);
    setBaseUrlState(url);
    checkHealth();
    if (token) {
      refreshUser();
    }
  };

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const res = await apiService.login(credentials);
      setStoredToken(res.access_token);
      setTokenState(res.access_token);
      setUser(res.user);
      return res;
    } catch (err) {
      throw new Error(parseApiError(err));
    }
  };

  const register = async (data: AccountCreate): Promise<AccountResponse> => {
    try {
      const res = await apiService.register(data);
      return res;
    } catch (err) {
      throw new Error(parseApiError(err));
    }
  };

  const logout = () => {
    setStoredToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        health,
        healthLatency,
        baseUrl,
        setBaseUrl,
        login,
        register,
        logout,
        refreshUser,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
