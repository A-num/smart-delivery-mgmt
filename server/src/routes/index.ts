import express from 'express';

import partnerRoutes from './partnerRoutes'
import authRoutes from './auth';
import managerRoutes from './managerRoutes';
import orderRoutes from './orderRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', managerRoutes);
router.use('/orders', orderRoutes);
router.use('/partners', partnerRoutes);
export default router;
