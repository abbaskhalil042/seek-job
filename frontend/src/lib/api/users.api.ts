import { apiGet, apiPatch } from "./client";
import type { EmployerProfile, SeekerProfile, User } from "@/types";

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
  seekerProfile?: Partial<SeekerProfile>;
  employerProfile?: Partial<EmployerProfile>;
}

export const usersApi = {
  me: () => apiGet<User>("/users/me"),
  updateMe: (input: UpdateProfileInput) => apiPatch<User>("/users/me", input),
};
