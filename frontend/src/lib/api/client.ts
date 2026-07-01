import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "./token-store";
import type { ApiErrorBody, ApiResponse } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

/* --------------------------- Request: attach token -------------------------- */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/* --------------------- Response: transparent token refresh ------------------ */
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshing: Promise<string | null> | null = null;

/** Single-flight refresh so concurrent 401s don't trigger multiple calls. */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Bare axios call to avoid recursive interceptors.
    const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${API_URL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true },
    );
    tokenStore.set(data.data);
    return data.data.accessToken;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isAuthRoute = original?.url?.includes("/auth/");

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      refreshing = refreshing ?? refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;

      if (newToken) {
        const headers = AxiosHeaders.from(original.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        original.headers = headers;
        return api(original);
      }
      // Refresh failed → broadcast logout so the AuthProvider can redirect.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sj:unauthorized"));
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

export interface NormalizedError {
  status?: number;
  message: string;
  details?: unknown;
}

/** Turn an axios error into a friendly, consistent shape. */
export function normalizeError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return {
      status: error.response?.status,
      message: body?.message || error.message || "Something went wrong",
      details: body?.details,
    };
  }
  return { message: error instanceof Error ? error.message : "Unexpected error" };
}

/* ------------------------------ Tiny helpers ------------------------------- */

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await api.get<ApiResponse<T>>(url, config);
  return data;
}
export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
  const { data } = await api.post<ApiResponse<T>>(url, body, config);
  return data;
}
export async function apiPatch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
  const { data } = await api.patch<ApiResponse<T>>(url, body, config);
  return data;
}
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await api.delete<ApiResponse<T>>(url, config);
  return data;
}
