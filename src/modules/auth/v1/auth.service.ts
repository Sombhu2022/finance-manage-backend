import { db } from '../../../core/database/index.js';
import { users } from '../../users/v1/users.model.js';
import { AppError } from '../../../shared/middlewares/error.js';
import { UserRole, UserStatus } from '../../../shared/constants/enums.js';
import { eq } from 'drizzle-orm';
import { securityUtil } from '../../../shared/utils/security.util.js';
import { emailService } from '../../../shared/services/email.service.js';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  VerifyOtpDTO,
  ResendOtpDTO,
} from './auth.types.js';

export class AuthService {
  /**
   * Registers a new user.
   * Generates a 6-digit OTP and sends it via email.
   * @param data User registration details
   * @returns Created user data (without token)
   */
  register = async (data: RegisterDTO): Promise<AuthResponse> => {
    const { email, password, role } = data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password using security utility
    const hashedPassword = await securityUtil.hashPassword(password);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with PENDING status
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role: role || UserRole.VIEWER,
        status: UserStatus.PENDING,
        otp,
        otpExpiresAt,
      })
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
      });

    // Send OTP email (async-non-blocking)
    emailService.sendOtpEmail(email, otp);

    return {
      user: newUser,
      message:
        'Registration successful. Please check your email for the 6-digit verification code.',
    };
  };

  /**
   * Verifies the 6-digit OTP for a user.
   * @param data Email and OTP
   */
  verifyOtp = async (data: VerifyOtpDTO): Promise<AuthResponse> => {
    const { email, otp } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new AppError('User is already verified', 400);
    }

    if (user.otp !== otp) {
      throw new AppError('Invalid verification code', 400);
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new AppError('Verification code has expired', 400);
    }

    // Activate user and clear OTP
    await db
      .update(users)
      .set({
        status: UserStatus.ACTIVE,
        otp: null,
        otpExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    // Generate token for immediate login
    const token = securityUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: 'Email verified successfully. You are now logged in.',
    };
  };

  /**
   * Resends the 6-digit OTP to the user.
   * @param data Email
   */
  resendOtp = async (data: ResendOtpDTO): Promise<AuthResponse> => {
    const { email } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new AppError('User is already verified', 400);
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db
      .update(users)
      .set({
        otp,
        otpExpiresAt,
      })
      .where(eq(users.id, user.id));

    // Send OTP email (async-non-blocking)
    emailService.sendOtpEmail(email, otp);

    return {
      message: 'A new verification code has been sent to your email.',
    };
  };

  /**
   * Authenticates a user.
   * Compares password hashes and generates a JWT.
   * @param data User login details
   * @returns JWT and user info
   */
  login = async (data: LoginDTO): Promise<AuthResponse> => {
    const { email, password } = data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Compare password using security utility
    if (
      !user ||
      !(await securityUtil.comparePassword(password, user.password))
    ) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is verified
    if (user.status === UserStatus.PENDING) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new AppError(
        'Your account is currently inactive. Please contact support.',
        403,
      );
    }

    // Generate token using security utility
    const token = securityUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  };
}

export const authService = new AuthService();
