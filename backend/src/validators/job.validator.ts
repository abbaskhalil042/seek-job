import { z } from 'zod';
import {
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkMode,
} from '../constants';

const salarySchema = z.object({
  min: z.number().min(0).optional(),
  max: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  period: z.enum(['hour', 'month', 'year']).default('year'),
});

const jobBody = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(20),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  jobType: z.nativeEnum(JobType),
  workMode: z.nativeEnum(WorkMode),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  location: z.string().max(160).optional(),
  salary: salarySchema.optional(),
  openings: z.number().int().min(1).optional(),
  deadline: z.string().datetime().optional().or(z.string().date().optional()),
  status: z.nativeEnum(JobStatus).optional(),
});

export const createJobSchema = z.object({ body: jobBody });

export const updateJobSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: jobBody.partial(),
});

export const jobIdParamSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
});

export const updateJobStatusSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({ status: z.nativeEnum(JobStatus) }),
});

export const jobSlugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});
