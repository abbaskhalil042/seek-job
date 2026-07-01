import { api } from "./client";
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { ApiResponse, Resume } from "@/types";

export const resumesApi = {
  list: () => apiGet<Resume[]>("/resumes"),

  byId: (id: string) => apiGet<Resume>(`/resumes/${id}`),

  upload: async (file: File, makePrimary = true) => {
    const form = new FormData();
    form.append("resume", file);
    form.append("makePrimary", String(makePrimary));
    const { data } = await api.post<ApiResponse<Resume>>("/resumes", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  reparse: (id: string) => apiPost<Resume>(`/resumes/${id}/reparse`),

  setPrimary: (id: string) => apiPatch<Resume>(`/resumes/${id}/primary`),

  remove: (id: string) => apiDelete<null>(`/resumes/${id}`),
};
