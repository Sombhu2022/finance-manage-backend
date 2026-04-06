import { TransactionResponse } from '../../finance/v1/finance.types.js';

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface DashboardSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryWiseTotals: CategoryTotal[];
  recentActivity: TransactionResponse[];
}
