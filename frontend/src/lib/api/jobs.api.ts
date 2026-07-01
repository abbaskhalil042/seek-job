import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type {
  ExperienceLevel,
  Job,
  JobStatus,
  JobType,
  SalaryRange,
  WorkMode,
} from "@/types";

export interface JobSearchParams {
  q?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  location?: string;
  skills?: string;
  minSalary?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface JobInput {
  title: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location?: string;
  salary?: SalaryRange;
  openings?: number;
  deadline?: string;
  status?: JobStatus;
}

export const jobsApi = {
  search: (params: JobSearchParams) =>
    apiGet<Job[]>("/jobs", { params }),

  bySlug: (slug: string) => apiGet<Job>(`/jobs/slug/${slug}`),

  byId: (id: string) => apiGet<Job>(`/jobs/${id}`),

  mine: (params: { status?: JobStatus; page?: number; limit?: number }) =>
    apiGet<Job[]>("/jobs/me/list", { params }),

  create: (input: JobInput) => apiPost<Job>("/jobs", input),

  update: (id: string, input: Partial<JobInput>) =>
    apiPatch<Job>(`/jobs/${id}`, input),

  updateStatus: (id: string, status: JobStatus) =>
    apiPatch<Job>(`/jobs/${id}/status`, { status }),

  remove: (id: string) => apiDelete<null>(`/jobs/${id}`),

  skills: () => apiGet<string[]>("/jobs/skills"),
};
