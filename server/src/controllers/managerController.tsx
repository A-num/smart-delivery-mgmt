import { Request, Response } from 'express';
import Partner from '../models/partnerModel';
import Order from '../models/orderModel';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { location, status, area } = req.body;

    // ✅ Find available partners in the specified area
    const availablePartners = await Partner.find({
      status: 'active',
      areas: area, // Match partners servicing the specified area
    });

    if (availablePartners.length === 0) {
      return res.status(400).json({ message: 'No available partners in this area' });
    }

    // ✅ Sort partners by current load (lower load is preferred)
    availablePartners.sort((a, b) => {
      const loadDifference = a.currentLoad - b.currentLoad;
      if (loadDifference !== 0) return loadDifference;
      const A = a.metrics?.rating ?? 0;
      const B = b.metrics?.rating ?? 0;
      return B - A ; // Prefer higher rated partners if load is the same
    });

    // ✅ Assign the order to the least loaded partner
    const assignedPartner = availablePartners[0];

    const newOrder = new Order({
      partnerId: assignedPartner._id,
      location,
      status,
      area,
    });

    await newOrder.save();

    // ✅ Update partner load
    await Partner.findByIdAndUpdate(assignedPartner._id, {
      $inc: { currentLoad: 1 },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};
