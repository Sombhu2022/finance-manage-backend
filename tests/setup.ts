import { jest } from '@jest/globals';

// Mock logger to avoid cluttering test output
jest.mock('../src/core/config/logger.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock Email Service
jest.mock('../src/shared/services/email.service.js', () => ({
  emailService: {
    sendOtpEmail: jest.fn<any>().mockResolvedValue(true),
  },
}));

// Ported Database Mocking Strategy:
// In ESM, we use jest.unstable_mockModule in each test file to ensure
// correct module resolution and isolation for Drizzle ORM.
// Global mocks in setup.ts are avoided for the database client to prevent ESM resolution conflicts.
