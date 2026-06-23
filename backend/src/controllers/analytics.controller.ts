import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { analyticsService } from '../services/analytics.service';

export const employerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.employerDashboard(req.user!.sub);
  return sendSuccess(res, data, 'Employer dashboard');
});

export const seekerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.seekerDashboard(req.user!.sub);
  return sendSuccess(res, data, 'Seeker dashboard');
});

export const adminOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.adminOverview();
  return sendSuccess(res, data, 'Admin overview');
});
