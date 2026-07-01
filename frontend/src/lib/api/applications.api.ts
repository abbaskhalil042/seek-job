import { apiGet, apiPatch, apiPost } from "./client";
import type { Application, ApplicationStatus } from "@/types";

export interface ApplyInput {
  jobId: string;
  resumeId?: string;
  coverLetter?: string;
}

export const applicationsApi = {
  apply: (input: ApplyInput) => apiPost<Application>("/applications", input),

  mine: (params: { status?: ApplicationStatus; page?: number; limit?: number }) =>
    apiGet<Application[]>("/applications/me", { params }),

  forJob: (
    jobId: string,
    params: { status?: ApplicationStatus; page?: number; limit?: number },
  ) => apiGet<Application[]>(`/jobs/${jobId}/applications`, { params }),

  byId: (id: string) => apiGet<Application>(`/applications/${id}`),

  updateStatus: (id: string, status: ApplicationStatus, note?: string) =>
    apiPatch<Application>(`/applications/${id}/status`, { status, note }),

  withdraw: (id: string) => apiPatch<Application>(`/applications/${id}/withdraw`),
};
