import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { userService } from '../services/user.service';

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.user!.sub);
  return sendSuccess(res, user, 'Profile fetched');
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.sub, req.user!.role, req.body);
  return sendSuccess(res, user, 'Profile updated');
});

export const deactivateMyAccount = asyncHandler(async (req: Request, res: Response) => {
  await userService.deactivate(req.user!.sub);
  return sendSuccess(res, null, 'Account deactivated');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id);
  return sendSuccess(res, user, 'User fetched');
});
