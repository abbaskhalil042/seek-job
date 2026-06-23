import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { applicationService } from '../services/application.service';

const paginationMeta = (r: { total: number; page: number; limit: number; totalPages: number }) => ({
  pagination: { total: r.total, page: r.page, limit: r.limit, totalPages: r.totalPages },
});

export const apply = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationService.apply(req.user!.sub, req.body);
  return sendSuccess(res, application, 'Application submitted', 201);
});

export const myApplications = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.listForApplicant(req.user!.sub, req.query as Record<string, unknown>);
  return sendSuccess(res, result.items, 'Applications fetched', 200, paginationMeta(result));
});

export const jobApplications = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.listForJob(
    req.params.jobId,
    req.user!.sub,
    req.user!.role,
    req.query as Record<string, unknown>,
  );
  return sendSuccess(res, result.items, 'Applications fetched', 200, paginationMeta(result));
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationService.getById(req.params.id, req.user!.sub, req.user!.role);
  return sendSuccess(res, application, 'Application fetched');
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationService.updateStatus(
    req.params.id,
    req.user!.sub,
    req.user!.role,
    req.body.status,
    req.body.note,
  );
  return sendSuccess(res, application, 'Application status updated');
});

export const withdrawApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationService.withdraw(req.params.id, req.user!.sub);
  return sendSuccess(res, application, 'Application withdrawn');
});
