import { z } from 'zod';
import { TransactionType } from '../../../shared/constants/enums.js';

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const transactionFilterSchema = z.object({
  category: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
