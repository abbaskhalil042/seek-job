import { apiGet, apiPost } from "./client";
import type { AuthPayload, User, UserRole } from "@/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
}

export const authApi = {
  register: (input: RegisterInput) =>
    apiPost<AuthPayload>("/auth/register", input),

  login: (email: string, password: string) =>
    apiPost<AuthPayload>("/auth/login", { email, password }),

  logout: (refreshToken?: string) =>
    apiPost<null>("/auth/logout", { refreshToken }),

  me: () => apiGet<User>("/auth/me"),
};
