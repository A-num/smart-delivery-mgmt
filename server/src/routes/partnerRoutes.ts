import express from 'express';
import {
  getPartnerDashboard,
  updateAvailabilityStatus,
  getPartnerProfile,
  updatePartnerProfile,
  getAvailableAreas,
  getPartners,
  updatePartnerAreas,
} from '../controllers/partnerController';

const router = express.Router();

router.get('/', getPartners);
router.get('/:partnerId/dashboard', getPartnerDashboard);
router.put('/:partnerId/status', updateAvailabilityStatus);
router.get('/:partnerId/profile', getPartnerProfile);
router.put('/:partnerId/profile', updatePartnerProfile);
router.put('/:partnerId/areas', updatePartnerAreas);
router.get('/areas', getAvailableAreas);

export default router;
