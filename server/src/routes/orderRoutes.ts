import express from 'express';
import {
  createOrder,
  getOrders,
  getOrdersByPartnerId,
  getIncompleteOrders
} from '../controllers/orderController'

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/get-orders-by-partner-id/:id', getOrdersByPartnerId);
router.get('/get-incomplete-orders', getIncompleteOrders);

export default router;
