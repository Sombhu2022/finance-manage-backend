import { Response } from 'express';
import { financeService } from './finance.service.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFilterSchema,
} from './finance.validation.js';
import { AuthRequest } from '../../../shared/middlewares/auth.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export class FinanceController {
  getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Validate filters
    const validatedFilters = transactionFilterSchema.parse(req.query);

    // Call service
    const results = await financeService.getTransactions(validatedFilters);

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: { transactions: results },
    });
  });

  createTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    // Validate request
    const validatedData = createTransactionSchema.parse(req.body);

    // Call service
    const newTransaction = await financeService.createTransaction(
      userId,
      validatedData,
    );

    res.status(201).json({
      status: 'success',
      data: { transaction: newTransaction },
    });
  });

  updateTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Validate request
    const validatedData = updateTransactionSchema.parse(req.body);

    // Call service
    const updatedTransaction = await financeService.updateTransaction(
      id as string,
      validatedData,
    );

    res.status(200).json({
      status: 'success',
      data: { transaction: updatedTransaction },
    });
  });

  deleteTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Call service
    await financeService.deleteTransaction(id as string);

    res.status(200).json({
      status: 'success',
      message: 'Transaction deleted successfully',
    });
  });
}

export const financeController = new FinanceController();
