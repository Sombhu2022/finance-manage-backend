import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks
jest.unstable_mockModule('../../../../core/database/index.js', () => ({
  db: {
    query: {
      users: { findMany: jest.fn() },
    },
  },
}));

import { UserRole, UserStatus } from '../../../../shared/constants/enums.js';

// Dynamic Imports
const { db } = await import('../../../../core/database/index.js');
const { securityUtil } = await import('../../../../shared/utils/security.util.js');
const { default: createApp } = await import('../../../../core/app.js');

const app = createApp();

describe('Users API', () => {
  const mockAnalyst = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'analyst@example.com',
    role: UserRole.ANALYST,
    status: UserStatus.ACTIVE,
  };
  const mockViewer = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'viewer@example.com',
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
  };

  const analystToken = `Bearer ${securityUtil.generateToken({
    id: mockAnalyst.id,
    email: mockAnalyst.email,
    role: mockAnalyst.role,
  })}`;
  const viewerToken = `Bearer ${securityUtil.generateToken({
    id: mockViewer.id,
    email: mockViewer.email,
    role: mockViewer.role,
  })}`;

  describe('GET /api/v1/users', () => {
    it('should allow ANALYST to get all users', async () => {
      (db.query.users.findMany as any).mockResolvedValue([
        mockAnalyst,
        mockViewer,
      ]);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', analystToken);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.users[0].email).toBe(mockAnalyst.email);
    });

    it('should return 403 if VIEWER tries to get all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', viewerToken);

      expect(response.status).toBe(403);
    });
  });
});
