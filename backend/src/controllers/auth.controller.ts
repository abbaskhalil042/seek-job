import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  return sendSuccess(res, result, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  return sendSuccess(res, result, 'Logged in successfully');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('Refresh token missing');
  const tokens = await authService.refresh(token);
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);
  return sendSuccess(res, tokens, 'Token refreshed');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (req.user) await authService.logout(req.user.sub, token);
  res.clearCookie('refreshToken', { path: '/' });
  return sendSuccess(res, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.sub);
  return sendSuccess(res, user, 'Current user');
});
