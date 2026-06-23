import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { UserRole } from '../constants';

/** Require a valid access token; attaches `req.user`. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token =
    header?.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.accessToken as string | undefined);

  if (!token) return next(ApiError.unauthorized('Authentication token missing'));

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Restrict a route to one or more roles. Must run after `authenticate`. */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (roles.length && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }
    return next();
  };
}

/** Optional auth: populates `req.user` if a token is present, never errors. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      /* ignore invalid token for optional routes */
    }
  }
  return next();
}
