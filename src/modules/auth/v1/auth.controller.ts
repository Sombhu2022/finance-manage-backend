import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from './auth.validation.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const validatedData = registerSchema.parse(req.body);

    // Call service
    const result = await authService.register(validatedData);

    res.status(201).json({
      status: 'success',
      message: result.message,
      data: result.user,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const validatedData = loginSchema.parse(req.body);

    // Call service
    const result = await authService.login(validatedData);

    res.status(200).json({
      status: 'success',
      token: result.token,
      data: {
        user: result.user,
      },
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const validatedData = verifyOtpSchema.parse(req.body);

    // Call service
    const result = await authService.verifyOtp(validatedData);

    res.status(200).json({
      status: 'success',
      message: result.message,
      token: result.token,
      data: {
        user: result.user,
      },
    });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const validatedData = resendOtpSchema.parse(req.body);

    // Call service
    const result = await authService.resendOtp(validatedData);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  });
}

export const authController = new AuthController();
