import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { assignOrder } from '../services/assignmentService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    const result = await assignOrder((newOrder._id).toString());

    res.status(201).json({ order: newOrder, assignmentResult: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};
