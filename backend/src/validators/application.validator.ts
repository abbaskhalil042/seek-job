import { z } from 'zod';
import { ApplicationStatus } from '../constants';

export const applySchema = z.object({
  body: z.object({
    jobId: z.string().length(24),
    resumeId: z.string().length(24).optional(),
    coverLetter: z.string().max(5000).optional(),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({
    status: z.nativeEnum(ApplicationStatus),
    note: z.string().max(1000).optional(),
  }),
});
