import { Router } from 'express';
import { usersController } from './users.controller.js';
import { protect } from '../../../shared/middlewares/auth.js';
import { restrictTo } from '../../../shared/middlewares/roles.js';
import { UserRole } from '../../../shared/constants/enums.js';

const router = Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       403:
 *         description: Only ADMIN and ANALYST can access
 */
router.get(
  '/',
  restrictTo(UserRole.ADMIN, UserRole.ANALYST),
  usersController.getUsers,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Only ADMIN can access
 */
router.patch('/:id', restrictTo(UserRole.ADMIN), usersController.updateUser);

export default router;
