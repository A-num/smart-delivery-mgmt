import express from 'express';
import {
  getPartnerList,
  getPerformanceMetrics,
  getAssignmentHistory,
  getAssignment,
} from '../controllers/managerController'

const router = express.Router();

router.get('/partners', getPartnerList);
router.get('/performance', getPerformanceMetrics);
router.get('/history', getAssignmentHistory);
router.get('/assignments', getAssignment);

export default router;
