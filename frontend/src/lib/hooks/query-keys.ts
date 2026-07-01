import type { JobSearchParams } from "@/lib/api/jobs.api";
import type { ApplicationStatus, JobStatus } from "@/types";

/** Centralised, typed query-key factory for TanStack Query. */
export const queryKeys = {
  auth: ["auth", "me"] as const,

  jobs: {
    all: ["jobs"] as const,
    search: (params: JobSearchParams) => ["jobs", "search", params] as const,
    bySlug: (slug: string) => ["jobs", "slug", slug] as const,
    byId: (id: string) => ["jobs", "id", id] as const,
    mine: (status?: JobStatus) => ["jobs", "mine", status ?? "all"] as const,
    skills: ["jobs", "skills"] as const,
  },

  resumes: {
    all: ["resumes"] as const,
    byId: (id: string) => ["resumes", id] as const,
  },

  applications: {
    mine: (status?: ApplicationStatus) =>
      ["applications", "mine", status ?? "all"] as const,
    forJob: (jobId: string, status?: ApplicationStatus) =>
      ["applications", "job", jobId, status ?? "all"] as const,
    byId: (id: string) => ["applications", id] as const,
  },

  analytics: {
    employer: ["analytics", "employer"] as const,
    seeker: ["analytics", "seeker"] as const,
  },
} as const;
