import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { jobService } from '../services/job.service';

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.create(req.user!.sub, req.body);
  return sendSuccess(res, job, 'Job created', 201);
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.update(req.params.id, req.user!.sub, req.user!.role, req.body);
  return sendSuccess(res, job, 'Job updated');
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  await jobService.remove(req.params.id, req.user!.sub, req.user!.role);
  return sendSuccess(res, null, 'Job deleted');
});

export const updateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.updateStatus(
    req.params.id,
    req.user!.sub,
    req.user!.role,
    req.body.status,
  );
  return sendSuccess(res, job, 'Job status updated');
});

export const searchJobs = asyncHandler(async (req: Request, res: Response) => {
  const result = await jobService.search(req.query as Record<string, unknown>);
  return sendSuccess(res, result.items, 'Jobs fetched', 200, {
    pagination: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
  });
});

export const getJobBySlug = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.getBySlug(req.params.slug);
  return sendSuccess(res, job, 'Job fetched');
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.getById(req.params.id);
  return sendSuccess(res, job, 'Job fetched');
});

export const listMyJobs = asyncHandler(async (req: Request, res: Response) => {
  const result = await jobService.listByEmployer(req.user!.sub, req.query as Record<string, unknown>);
  return sendSuccess(res, result.items, 'Your jobs fetched', 200, {
    pagination: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
  });
});

export const listJobSkills = asyncHandler(async (_req: Request, res: Response) => {
  const skills = await jobService.listSkills();
  return sendSuccess(res, skills, 'Skills fetched');
});
