import { Request, Response } from 'express';
import Partner from '../models/partnerModel';
import Order from '../models/orderModel';

export const getPartnerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updatePartnerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;
    const { name, email, phone, areas, shift } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      {
        name,
        email,
        phone,
        areas,
        shift,
      },
      { new: true }
    );

    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const getAvailableAreas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const areas = ['North', 'South', 'East', 'West', 'Central'];
    res.status(200).json(areas);
  } catch (error) {
    console.error('Failed to fetch areas:', error);
    res.status(500).json({ message: 'Failed to fetch areas' });
  }
};

export const getPartnerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
       res.status(404).json({ message: 'Partner not found' });
    }

    const totalOrders = await Order.countDocuments({ partnerId });
    const completedOrders = await Order.countDocuments({
      partnerId,
      status: 'completed',
    });

    const activeOrders = await Order.find({ partnerId, status: 'active' });

    res.status(200).json({
      metrics: {
        totalOrders,
        completedOrders,
        rating: partner?.metrics?.rating ?? 0,
      },
      activeOrders,
      recentAssignments: activeOrders.slice(0, 5),
      availabilityStatus: partner?.status ?? 'Not available',
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

export const updateAvailabilityStatus = async (
  req: Request,
  res: Response
) : Promise<void> => {
  try {
    const partnerId = req.params.partnerId;
    const { status } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { status },
      { new: true }
    );

    if (!partner) {
       res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ status: partner?.status ?? 'Unknown'  });
  } catch (error) {
    console.error('Failed to update availability status:', error);
    res.status(500).json({ message: 'Failed to update availability status' });
  }
};