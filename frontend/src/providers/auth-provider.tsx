"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi, type RegisterInput } from "@/lib/api/auth.api";
import { tokenStore } from "@/lib/api/token-store";
import { roleHome } from "@/config/site";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUserState] = useState<User | null>(null);
  const [status, setStatus] =
    useState<AuthContextValue["status"]>("loading");

  /** Load the current user from the access token on mount. */
  const refreshUser = useCallback(async () => {
    if (!tokenStore.getAccessToken()) {
      setStatus("unauthenticated");
      setUserState(null);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUserState(data);
      setStatus("authenticated");
    } catch {
      tokenStore.clear();
      setUserState(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUser();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshUser]);

  /** React to a failed silent refresh broadcast by the axios interceptor. */
  useEffect(() => {
    const onUnauthorized = () => {
      setUserState(null);
      setStatus("unauthenticated");
      queryClient.clear();
    };
    window.addEventListener("sj:unauthorized", onUnauthorized);
    return () => window.removeEventListener("sj:unauthorized", onUnauthorized);
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUserState(data.user);
    setStatus("authenticated");
    return data.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { data } = await authApi.register(input);
    tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUserState(data.user);
    setStatus("authenticated");
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout(tokenStore.getRefreshToken() ?? undefined);
    } catch {
      /* ignore network errors on logout */
    }
    tokenStore.clear();
    setUserState(null);
    setStatus("unauthenticated");
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const setUser = useCallback((u: User) => setUserState(u), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, refreshUser, setUser }),
    [user, status, login, register, logout, refreshUser, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/** Convenience helper for role-based redirects after auth. */
export function homeForRole(role: User["role"]) {
  return roleHome[role] ?? "/";
}
