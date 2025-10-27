"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, logout as logoutApi, loginWithGoogle as loginWithGoogleApi, register as registerApi, registerChild as registerChildApi, refresh as refreshApi, UserDto } from "@/services/auth/authService";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: string;
  email: string; 
  name: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: UserDto | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  loginWithGoogle: (idToken: string) => Promise<UserDto>
  register: (name: string,
            email: string,
            password: string,
            roleId: number,
            dob?: Date,
            avatarUrl?: string) => Promise<void>;
  registerChild: (name: string,
                  email: string,
                  password: string,
                  parentId: number,
                  dob?: Date,
                  avatarUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    setRefreshTimer(null);
  };

  const handleAuthSuccess = useCallback((token: string) => {
    setAccessToken(token);
    const payload = jwtDecode<JwtPayload>(token);

    setUser({
      id: Number(payload.id),
      email: payload.email,
      name: payload.name,
      role: payload.role as any,
    });

    // Setup silent refresh
    clearRefreshTimer();
    const expiresInMs = payload.exp * 1000 - Date.now();
    const refreshBeforeMs = expiresInMs - 60 * 1000;

    if (refreshBeforeMs > 0) {
      const timer = setTimeout(async () => {
        try {
          const newToken = await refreshApi();
          handleAuthSuccess(newToken);
        } catch (err) {
          console.error("Silent refresh failed", err);
          await doLogout();
        }
      }, refreshBeforeMs);

      setRefreshTimer(timer);
    }
  }, []);

  // Helper: wrap actions in loading/finally
  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async (email: string, password: string) => withLoading(async () => {
    try {
      const { accessToken: token, user: u } = await loginApi(email, password);
      handleAuthSuccess(token);
      return u;
    } catch (err) {
      throw err;
    }
  });

  const doLoginWithGoogle = async (idToken: string) => withLoading(async () => {
    try {
      const { accessToken: token, user: u } = await loginWithGoogleApi(idToken)
      handleAuthSuccess(token)
      return u
    } catch (error) {
      throw error
    }
  });

  const doRegister = async (
    name: string,
    email: string,
    password: string,
    roleId: number,
    dob?: Date,
    avatarUrl?: string
  ) => withLoading(async () => {
    try {
      await registerApi(name, email, password, roleId, dob, avatarUrl);
    } catch (err) {
      throw err;
    }
  });

  const doRegisterChild = async (
    name: string,
    email: string,
    password: string,
    parentId: number,
    dob?: Date,
    avatarUrl?: string
  ) => withLoading(async () => {
    try {
      await registerChildApi(name, email, password, parentId, dob, avatarUrl);
    } catch (err) {
      throw err;
    }
  });

  const doLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      clearRefreshTimer();
      setUser(null);
      setAccessToken(null);
      setLoading(false);
    }
  };

  //On first load we can attempt a silent refresh to restore session
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshApi();
        handleAuthSuccess(token);
      } catch {
        await doLogout();
      } finally {
        setLoading(false);
      }
    })();

    return clearRefreshTimer;
  }, [handleAuthSuccess]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login: doLogin,
      loginWithGoogle: doLoginWithGoogle,
      register: doRegister,
      registerChild: doRegisterChild,
      logout: doLogout,
      isAuthenticated: !!user,
    }),
    [user, accessToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
