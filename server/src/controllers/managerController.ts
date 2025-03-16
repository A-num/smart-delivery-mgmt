import { Request, Response } from 'express';
import Partner from '../models/partnerModel';
import Order from '../models/orderModel';
import Assignment from '../models/assignmentModel';

export const getAssignment = async(_req: Request, res: Response) => {
    try {
      const assignments = await Assignment.find();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch assignments' });
    }
}

export const getPartnerList = async (_req: Request, res: Response) => {
    try {
      const partners = await Partner.find();
      res.status(200).json(partners);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch partners' });
    }
  };
  
  export const getPerformanceMetrics = async (_req: Request, res: Response) => {
    try {
      const totalOrders = await Order.countDocuments();
      const completedOrders = await Order.countDocuments({ status: 'completed' });
      const avgRating = await Partner.aggregate([{ $group: { _id: null, avgRating: { $avg: '$metrics.rating' } } }]);
  
      res.status(200).json({
        totalOrders,
        completedOrders,
        avgRating: avgRating[0]?.avgRating || 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch performance metrics' });
    }
  };
  
  export const getAssignmentHistory = async (_req: Request, res: Response) => {
    try {
      const completedOrders = await Order.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(10);
      res.status(200).json(completedOrders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch assignment history' });
    }
  };
