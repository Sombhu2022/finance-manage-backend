import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks
jest.unstable_mockModule('../../../../core/database/index.js', () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(),
        })),
      })),
    })),
  } as any,
}));

jest.unstable_mockModule('../../../../shared/services/email.service.js', () => ({
  emailService: {
    sendOtpEmail: jest.fn(),
  } as any,
}));

import { UserRole, UserStatus } from '../../../../shared/constants/enums.js';

// Dynamic Imports
const { db } = await import('../../../../core/database/index.js');
const { emailService } =
  await import('../../../../shared/services/email.service.js');
const { securityUtil } = await import('../../../../shared/utils/security.util.js');
const { default: createApp } = await import('../../../../core/app.js');

const app = createApp();

describe('Auth API', () => {
  const password = 'password123';
  let hashedPassword = '';
  let mockUser: any = null;

  beforeAll(async () => {
    hashedPassword = await securityUtil.hashPassword(password);
    mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: hashedPassword,
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
      otp: '123456',
      otpExpiresAt: new Date(Date.now() + 100000),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (emailService.sendOtpEmail as any).mockResolvedValue(true);
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(null);
      const insertMock: any = jest.fn(() =>
        Promise.resolve([
          {
            id: 'u1',
            email: 'test@example.com',
            role: UserRole.VIEWER,
          },
        ]),
      );
      (db.insert as any).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: insertMock,
        }),
      });

      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
      expect(response.body.data.email).toBe('test@example.com');
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
      );
    });

    it('should return 400 if user already exists', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 with invalid credentials', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/v1/auth/verify-otp', () => {
    it('should verify OTP successfully', async () => {
      const pendingUser = { ...mockUser, status: UserStatus.PENDING };
      (db.query.users.findFirst as any).mockResolvedValue(pendingUser);

      const updateMock: any = jest.fn(() => Promise.resolve([pendingUser]));
      (db.update as any).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: updateMock,
        }),
      });

      const response = await request(app).post('/api/v1/auth/verify-otp').send({
        email: 'test@example.com',
        otp: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Email verified successfully');
    });

    it('should return 400 with incorrect OTP', async () => {
      (db.query.users.findFirst as any).mockResolvedValue({
        ...mockUser,
        status: UserStatus.PENDING,
      });

      const response = await request(app).post('/api/v1/auth/verify-otp').send({
        email: 'test@example.com',
        otp: '654321',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid verification code');
    });
  });

  describe('POST /api/v1/auth/resend-otp', () => {
    it('should resend OTP successfully', async () => {
      (db.query.users.findFirst as any).mockResolvedValue({
        ...mockUser,
        status: UserStatus.PENDING,
      });

      const updateMock: any = jest.fn(() => Promise.resolve([]));
      (db.update as any).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: updateMock,
        }),
      });

      const response = await request(app).post('/api/v1/auth/resend-otp').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain(
        'new verification code has been sent',
      );
      expect(emailService.sendOtpEmail).toHaveBeenCalled();
    });
  });
});
