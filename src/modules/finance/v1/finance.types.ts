import { TransactionType } from '../../../shared/constants/enums.js';

export interface CreateTransactionDTO {
  amount: number;
  type: TransactionType;
  category: string;
  date?: string;
  notes?: string;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  notes?: string;
}

export interface TransactionFilter {
  category?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface TransactionResponse {
  id: string;
  userId: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
