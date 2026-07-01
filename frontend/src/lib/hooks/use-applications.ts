"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applicationsApi,
  type ApplyInput,
} from "@/lib/api/applications.api";
import { queryKeys } from "./query-keys";
import type { ApplicationStatus } from "@/types";

export function useMyApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: queryKeys.applications.mine(status),
    queryFn: () => applicationsApi.mine({ status, limit: 50 }),
  });
}

export function useJobApplications(jobId: string, status?: ApplicationStatus) {
  return useQuery({
    queryKey: queryKeys.applications.forJob(jobId, status),
    queryFn: () => applicationsApi.forJob(jobId, { status, limit: 100 }),
    enabled: !!jobId,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.byId(id),
    queryFn: () => applicationsApi.byId(id),
    enabled: !!id,
  });
}

export function useApply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplyInput) => applicationsApi.apply(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.seeker });
    },
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: ApplicationStatus;
      note?: string;
    }) => applicationsApi.updateStatus(id, status, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.employer });
    },
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.withdraw(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
