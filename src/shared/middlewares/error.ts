import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../../core/config/logger.js';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
  }

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
