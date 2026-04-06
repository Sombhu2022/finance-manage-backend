import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks
// Use 'mock' prefix for variables to be accessible within the unstable_mockModule factory
const mockSelectResults = [
  [{ value: 1000 }], // totalIncome
  [{ value: 400 }], // totalExpenses
  [{ category: 'Food', total: 400 }], // expensesByCategory
];
let mockSelectCallCount = 0;

jest.unstable_mockModule('../../../../core/database/index.js', () => {
  const mockChain = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    then: jest.fn((resolve: any) => {
      const result =
        mockSelectResults[mockSelectCallCount % mockSelectResults.length] || [];
      mockSelectCallCount++;
      return Promise.resolve(resolve(result));
    }),
  };

  return {
    db: {
      query: {
        users: { findFirst: jest.fn() },
        transactions: { findFirst: jest.fn(), findMany: jest.fn() },
      },
      select: jest.fn(() => mockChain) as any,
      delete: jest.fn(() => mockChain) as any,
      insert: jest.fn(() => mockChain) as any,
      update: jest.fn(() => mockChain) as any,
    },
  };
});

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

describe('Dashboard API', () => {
  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
  };
  const mockToken = `Bearer ${securityUtil.generateToken({
    id: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
  })}`;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectCallCount = 0;
  });

  describe('GET /api/v1/dashboard/summary', () => {
    it('should return dashboard summary statistics', async () => {
      (db.query.users.findFirst as any).mockResolvedValue(mockUser);
      (db.query.transactions.findMany as any).mockResolvedValue([
        {
          id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
          amount: 500,
          type: TransactionType.INCOME,
          category: 'Salary',
          date: new Date(),
        },
      ]);

      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', mockToken);

      expect(response.status).toBe(200);
      expect(response.body.data.totalIncome).toBe(1000);
      expect(response.body.data.totalExpenses).toBe(400);
      expect(response.body.data.netBalance).toBe(600);
      expect(response.body.data.recentActivity).toHaveLength(1);
    });
  });
});
