import { jest } from '@jest/globals';
import request from 'supertest';

// Mock must be called before importing the module that uses it
jest.unstable_mockModule('../shared/utils/db-migrate.js', () => ({
  runMigrations: jest.fn(),
}));

// Use dynamic imports after the mock module call
const { runMigrations } = await import('../shared/utils/db-migrate.js');
const { default: createApp } = await import('../core/app.js');

const app = createApp();

describe('Health API', () => {
  beforeEach(() => {
    (runMigrations as any).mockReset();
  });

  it('should return 200 OK and database status', async () => {
    (runMigrations as any).mockResolvedValue(true);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      database: 'Connected & Migrated',
      timestamp: expect.any(String),
    });
  });

  it('should return 500 if migration fails', async () => {
    (runMigrations as any).mockRejectedValue(new Error('Migration Error'));

    const response = await request(app).get('/health');

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('ERROR');
    expect(response.body.message).toBe('Database migration failed');
  });
});
