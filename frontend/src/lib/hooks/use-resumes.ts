"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumesApi } from "@/lib/api/resumes.api";
import { queryKeys } from "./query-keys";

export function useResumes() {
  return useQuery({
    queryKey: queryKeys.resumes.all,
    queryFn: () => resumesApi.list(),
  });
}

export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, makePrimary }: { file: File; makePrimary?: boolean }) =>
      resumesApi.upload(file, makePrimary),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.resumes.all });
      qc.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
}

export function useReparseResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumesApi.reparse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.resumes.all }),
  });
}

export function useSetPrimaryResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumesApi.setPrimary(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.resumes.all }),
  });
}

export function useDeleteResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.resumes.all }),
  });
}
