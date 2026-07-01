"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobsApi, type JobInput, type JobSearchParams } from "@/lib/api/jobs.api";
import { queryKeys } from "./query-keys";
import type { JobStatus } from "@/types";

export function useJobSearch(params: JobSearchParams) {
  return useQuery({
    queryKey: queryKeys.jobs.search(params),
    queryFn: () => jobsApi.search(params),
    placeholderData: keepPreviousData,
  });
}

export function useJobBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.jobs.bySlug(slug),
    queryFn: () => jobsApi.bySlug(slug),
    enabled: !!slug,
  });
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.byId(id),
    queryFn: () => jobsApi.byId(id),
    enabled: !!id,
  });
}

export function useMyJobs(status?: JobStatus) {
  return useQuery({
    queryKey: queryKeys.jobs.mine(status),
    queryFn: () => jobsApi.mine({ status, limit: 50 }),
  });
}

export function useJobSkills() {
  return useQuery({
    queryKey: queryKeys.jobs.skills,
    queryFn: () => jobsApi.skills(),
    staleTime: 5 * 60_000,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobInput) => jobsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<JobInput> }) =>
      jobsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      jobsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
