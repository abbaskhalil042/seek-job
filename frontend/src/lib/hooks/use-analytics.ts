"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics.api";
import { usersApi, type UpdateProfileInput } from "@/lib/api/users.api";
import { queryKeys } from "./query-keys";

export function useEmployerDashboard() {
  return useQuery({
    queryKey: queryKeys.analytics.employer,
    queryFn: () => analyticsApi.employer(),
  });
}

export function useSeekerDashboard() {
  return useQuery({
    queryKey: queryKeys.analytics.seeker,
    queryFn: () => analyticsApi.seeker(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateMe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth }),
  });
}
