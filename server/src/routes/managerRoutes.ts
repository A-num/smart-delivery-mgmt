import express from 'express';
import {
  getPartnerList,
  getPerformanceMetrics,
  getAssignmentHistory,
  getAssignmentMetrics,
} from '../controllers/managerController'

const router = express.Router();

router.get('/partners', getPartnerList);
router.get('/performance', getPerformanceMetrics);
router.get('/history', getAssignmentHistory);
router.get('/assignment-metrics', getAssignmentMetrics);

export default router;
