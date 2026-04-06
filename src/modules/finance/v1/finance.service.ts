import { db } from '../../../core/database/index.js';
import { transactions } from './finance.model.js';
import { AppError } from '../../../shared/middlewares/error.js';
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilter,
  TransactionResponse,
} from './finance.types.js';

export class FinanceService {
  getTransactions = async (
    filters: TransactionFilter,
  ): Promise<TransactionResponse[]> => {
    const {
      category,
      type,
      startDate,
      endDate,
      sortBy = 'date',
      order = 'desc',
    } = filters;

    const conditions = [];

    if (category) conditions.push(eq(transactions.category, category));
    if (type) conditions.push(eq(transactions.type, type));
    if (startDate) conditions.push(gte(transactions.date, new Date(startDate)));
    if (endDate) conditions.push(lte(transactions.date, new Date(endDate)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderByColumn = (transactions as any)[sortBy] || transactions.date;
    const orderByExpression =
      order === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    const results = await db.query.transactions.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [orderByExpression],
    });

    return results as TransactionResponse[];
  };

  createTransaction = async (
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<TransactionResponse> => {
    const { amount, type, category, date, notes } = data;

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        amount: amount.toString(),
        type,
        category,
        date: date ? new Date(date) : undefined,
        notes,
      })
      .returning();

    return newTransaction as TransactionResponse;
  };

  updateTransaction = async (
    id: string,
    data: UpdateTransactionDTO,
  ): Promise<TransactionResponse> => {
    const { amount, type, category, date, notes } = data;

    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        amount: amount?.toString(),
        type,
        category,
        date: date ? new Date(date) : undefined,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, id))
      .returning();

    if (!updatedTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    return updatedTransaction as TransactionResponse;
  };

  deleteTransaction = async (id: string): Promise<void> => {
    const [deletedTransaction] = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    if (!deletedTransaction) {
      throw new AppError('Transaction not found', 404);
    }
  };
}

export const financeService = new FinanceService();
