import { Request, Response, NextFunction } from 'express';
import { securityUtil } from '../../shared/utils/security.util.js';
import { AppError } from './error.js';
import { UserRole } from '../../shared/constants/enums.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  try {
    const decoded = securityUtil.verifyToken(
      token,
    ) as Required<AuthRequest>['user'];
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return next(new AppError('Unauthorized: Invalid token', 401));
  }
};
