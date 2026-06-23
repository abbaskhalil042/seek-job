import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { resumeService } from '../services/resume.service';
import { ApiError } from '../utils/ApiError';

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No resume file uploaded (field name must be "resume")');
  const makePrimary = req.body.makePrimary !== 'false';
  const resume = await resumeService.uploadAndParse(req.user!.sub, req.file, makePrimary);
  return sendSuccess(res, resume.toJSON(), 'Resume uploaded and parsed', 201);
});

export const listMyResumes = asyncHandler(async (req: Request, res: Response) => {
  const resumes = await resumeService.listForOwner(req.user!.sub);
  return sendSuccess(res, resumes, 'Resumes fetched');
});

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.getById(req.params.id, req.user!.sub);
  return sendSuccess(res, resume.toJSON(), 'Resume fetched');
});

export const reparseResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.reparse(req.params.id, req.user!.sub);
  return sendSuccess(res, resume.toJSON(), 'Resume re-parsed');
});

export const setPrimaryResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.setPrimary(req.params.id, req.user!.sub);
  return sendSuccess(res, resume.toJSON(), 'Primary resume updated');
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.remove(req.params.id, req.user!.sub);
  return sendSuccess(res, null, 'Resume deleted');
});
