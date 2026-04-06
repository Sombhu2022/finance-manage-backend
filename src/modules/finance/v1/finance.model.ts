import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { TransactionType } from '../../../shared/constants/enums.js';
import { users } from '../../users/v1/users.model.js';

export const transactionTypeEnum = pgEnum('transaction_type', [
  TransactionType.INCOME,
  TransactionType.EXPENSE,
]);

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  date: timestamp('date').defaultNow().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
