import express from 'express';
import {
  createOrder,
  getOrders,
  getOrdersByPartnerId,
  getActiveOrders,
  getOrderById
} from '../controllers/orderController'

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/get-orders-by-partner-id/:id', getOrdersByPartnerId);
router.get('/get-active-orders/:id', getActiveOrders);
router.get('/get-order-by-id/:id', getOrderById)
export default router;
