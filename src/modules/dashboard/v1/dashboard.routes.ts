import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { protect } from '../../../shared/middlewares/auth.js';
import { restrictTo } from '../../../shared/middlewares/roles.js';
import { UserRole } from '../../../shared/constants/enums.js';

const router = Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       403:
 *         description: Forbidden
 */
router.get(
  '/summary',
  restrictTo(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER),
  dashboardController.getDashboardSummary,
);

export default router;
