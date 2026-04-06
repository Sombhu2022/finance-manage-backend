import { Router } from 'express';
import { financeController } from './finance.controller.js';
import { protect } from '../../../shared/middlewares/auth.js';
import { restrictTo } from '../../../shared/middlewares/roles.js';
import { UserRole } from '../../../shared/constants/enums.js';

const router = Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/v1/finance:
 *   get:
 *     summary: Get all transactions
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully
 */
router.get('/', financeController.getTransactions);

/**
 * @swagger
 * /api/v1/finance:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post('/', financeController.createTransaction);

/**
 * @swagger
 * /api/v1/finance/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */
router.patch('/:id', financeController.updateTransaction);

/**
 * @swagger
 * /api/v1/finance/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       403:
 *         description: Only ADMIN can delete
 */
router.delete(
  '/:id',
  restrictTo(UserRole.ADMIN),
  financeController.deleteTransaction,
);

export default router;
