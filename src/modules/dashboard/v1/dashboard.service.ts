import { db } from '../../../core/database/index.js';
import { transactions } from '../../finance/v1/finance.model.js';
import { TransactionType } from '../../../shared/constants/enums.js';
import { sql, desc, eq } from 'drizzle-orm';
import { DashboardSummaryResponse, CategoryTotal } from './dashboard.types.js';
import { TransactionResponse } from '../../finance/v1/finance.types.js';

export class DashboardService {
  getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
    // Get total income
    const [totalIncomeResult] = await db
      .select({ value: sql<number>`sum(amount)` })
      .from(transactions)
      .where(eq(transactions.type, TransactionType.INCOME));

    // Get total expenses
    const [totalExpensesResult] = await db
      .select({ value: sql<number>`sum(amount)` })
      .from(transactions)
      .where(eq(transactions.type, TransactionType.EXPENSE));

    const totalIncome = Number(totalIncomeResult?.value || 0);
    const totalExpenses = Number(totalExpensesResult?.value || 0);
    const balance = totalIncome - totalExpenses;

    // Get expenses by category
    const expensesByCategory = await db
      .select({
        category: transactions.category,
        total: sql<number>`sum(amount)`,
      })
      .from(transactions)
      .where(eq(transactions.type, TransactionType.EXPENSE))
      .groupBy(transactions.category);

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      limit: 5,
      orderBy: [desc(transactions.date)],
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance: balance,
      categoryWiseTotals: expensesByCategory as CategoryTotal[],
      recentActivity: recentTransactions as unknown as TransactionResponse[],
    };
  };
}

export const dashboardService = new DashboardService();
