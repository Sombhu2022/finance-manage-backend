import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks
jest.unstable_mockModule('../../../../core/database/index.js', () => ({
  db: {
    query: {
      users: { findFirst: jest.fn() },
      transactions: { findMany: jest.fn() },
    },
    insert: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
  },
}));

import {
  UserRole,
  UserStatus,
  TransactionType,
} from '../../../../shared/constants/enums.js';

// Dynamic Imports
const { db } = await import('../../../../core/database/index.js');
const { securityUtil } = await import('../../../../shared/utils/security.util.js');
const { default: createApp } = await import('../../../../core/app.js');

const app = createApp();

describe('Finance API', () => {
  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
  };
  const mockAdmin = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  };

  const userToken = `Bearer ${securityUtil.generateToken({
    id: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
  })}`;
  const adminToken = `Bearer ${securityUtil.generateToken({
    id: mockAdmin.id,
    email: mockAdmin.email,
    role: mockAdmin.role,
  })}`;
  const viewerToken = `Bearer ${securityUtil.generateToken({
    id: mockUser.id,
    email: mockUser.email,
    role: UserRole.VIEWER,
  })}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/finance', () => {
    it('should return transactions for authenticated user', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);
      (db.query.transactions.findMany as any).mockResolvedValue([
        {
          id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
          amount: 100,
          type: TransactionType.EXPENSE,
        },
      ]);

      const response = await request(app)
        .get('/api/v1/finance')
        .set('Authorization', userToken);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(1);
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).get('/api/v1/finance');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/finance', () => {
    it('should create a transaction successfully', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);
      const insertResult = [
        {
          id: '6ba7b810-9dad-11d1-80b4-00c04fd430c9',
          amount: 200,
          type: TransactionType.INCOME,
        },
      ];

      const insertMock = jest.fn(() => ({
        values: jest.fn(() => ({
          returning: jest.fn<any>().mockResolvedValue(insertResult),
          then: jest.fn<any>((resolve: any) =>
            Promise.resolve(resolve(insertResult)),
          ),
        })),
      }));
      (db.insert as any) = insertMock;

      const response = await request(app)
        .post('/api/v1/finance')
        .set('Authorization', userToken)
        .send({
          amount: 200,
          type: TransactionType.INCOME,
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date(),
        });

      expect(response.status).toBe(201);
    });
  });

  describe('DELETE /api/v1/finance/:id', () => {
    it('should allow ADMIN to delete transaction', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockAdmin);
      const deleteResult = [{ id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' }];

      const deleteMock = jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn<any>().mockResolvedValue(deleteResult),
          then: jest.fn<any>((resolve: any) =>
            Promise.resolve(resolve(deleteResult)),
          ),
        })),
      }));
      (db.delete as any) = deleteMock;

      const response = await request(app)
        .delete('/api/v1/finance/6ba7b810-9dad-11d1-80b4-00c04fd430c8')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
    });

    it('should return 403 if non-ADMIN tries to delete', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/v1/finance/6ba7b810-9dad-11d1-80b4-00c04fd430c8')
        .set('Authorization', viewerToken);

      expect(response.status).toBe(403);
    });
  });
});
