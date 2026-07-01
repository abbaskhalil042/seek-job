/**
 * Lightweight auth-token store.
 *
 * The access token is kept in memory (primary) and mirrored to localStorage so
 * a page reload can restore the session. The refresh token is persisted to
 * localStorage and used to silently obtain new access tokens. Subscribers are
 * notified whenever tokens change so the AuthProvider can react.
 */

const ACCESS_KEY = "sj.accessToken";
const REFRESH_KEY = "sj.refreshToken";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let hydrated = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  accessToken = window.localStorage.getItem(ACCESS_KEY);
  refreshToken = window.localStorage.getItem(REFRESH_KEY);
  hydrated = true;
}

export const tokenStore = {
  getAccessToken(): string | null {
    hydrate();
    return accessToken;
  },
  getRefreshToken(): string | null {
    hydrate();
    return refreshToken;
  },
  set(tokens: { accessToken: string; refreshToken: string }) {
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
      window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    }
    listeners.forEach((l) => l());
  },
  setAccessToken(token: string) {
    accessToken = token;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_KEY, token);
    }
  },
  clear() {
    accessToken = null;
    refreshToken = null;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
    }
    listeners.forEach((l) => l());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
