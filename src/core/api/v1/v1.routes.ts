import { Router } from 'express';
import authRoutes from '../../../modules/auth/v1/auth.routes.js';
import financeRoutes from '../../../modules/finance/v1/finance.routes.js';
import dashboardRoutes from '../../../modules/dashboard/v1/dashboard.routes.js';
import userRoutes from '../../../modules/users/v1/users.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/finance', financeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

export default router;
