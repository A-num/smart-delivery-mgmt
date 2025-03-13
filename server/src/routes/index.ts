import express from 'express';
import { createOrder } from '../controllers/orderController';
import {
    getPartnerDashboard,
    updateAvailabilityStatus,
    getPartnerProfile,
    updatePartnerProfile,
    getAvailableAreas,
  } from '../controllers/partnerController';
  import authRoutes from './auth';

const router = express.Router();

router.post('/orders', createOrder);
router.use('/auth', authRoutes);


export default router;
