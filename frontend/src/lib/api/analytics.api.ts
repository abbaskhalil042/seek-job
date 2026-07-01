import { apiGet } from "./client";
import type { EmployerDashboard, SeekerDashboard } from "@/types";

export const analyticsApi = {
  employer: () => apiGet<EmployerDashboard>("/analytics/employer"),
  seeker: () => apiGet<SeekerDashboard>("/analytics/seeker"),
};
