import { Response } from 'express';
import { dashboardService } from './dashboard.service.js';
import { AuthRequest } from '../../../shared/middlewares/auth.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export class DashboardController {
  getDashboardSummary = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      // Call service
      const summaryData = await dashboardService.getDashboardSummary();

      res.status(200).json({
        status: 'success',
        data: summaryData,
      });
    },
  );
}

export const dashboardController = new DashboardController();
