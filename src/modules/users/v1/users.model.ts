import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { UserRole, UserStatus } from '../../../shared/constants/enums.js';

export const userRoleEnum = pgEnum('user_role', [
  UserRole.VIEWER,
  UserRole.ANALYST,
  UserRole.ADMIN,
]);

export const userStatusEnum = pgEnum('user_status', [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.PENDING,
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default(UserRole.VIEWER).notNull(),
  status: userStatusEnum('status').default(UserStatus.PENDING).notNull(),
  otp: varchar('otp', { length: 6 }),
  otpExpiresAt: timestamp('otp_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
