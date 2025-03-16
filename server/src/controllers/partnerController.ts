import { Request, Response } from "express";
import Partner from "../models/partnerModel";
import Order from "../models/orderModel";

export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = Partner.find();

    res.status(201).json({ partners: partners });
  } catch (error) {
    res.status(500).json({ message: "Failed to get partners" });
  }
};
export const getPartnerProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updatePartnerProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;
    const { name, password, email, phone, shift } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      {
        name,
        password,
        email,
        phone,
        shift,
      },
      { new: true }
    );

    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ partner: partner });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getPartnerDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
    }

    const totalOrders = await Order.countDocuments({ assignedTo: partnerId });
    const completedOrders = await Order.countDocuments({
      assignedTo: partnerId,
      status: "completed",
    });

    const activeOrders = await Order.find({ assignedTo: partnerId, status: {$ne: "completed"}});
    const recentAssignments = await Order.find({ assignedTo: partnerId});
    
    res.status(200).json({
      metrics: {
        totalOrders,
        completedOrders,
        rating: partner?.metrics?.rating ?? 0,
      },
      activeOrders,
      recentAssignments: recentAssignments,
      availabilityStatus: partner?.status ?? "Not available",
      partner: partner
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export const updateAvailabilityStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;
    const { status } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { status },
      { new: true }
    );

    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ status: partner?.status ?? "Unknown" });
  } catch (error) {
    console.error("Failed to update availability status:", error);
    res.status(500).json({ message: "Failed to update availability status" });
  }
};

export const updatePartnerAreas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partnerId = req.params.partnerId;
    const { areas } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { areas },
      { new: true }
    );

    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ partner: partner });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updatePartnerShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { partnerId } = req.params;
    const { start, end } = req.body;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404).json({ message: "Partner not found" });
      return;
    }

    if (start && end) {
      partner.shift = {
        start: start,
        end: end,
      };
    }

    await partner.save();

    res.status(200).json({ message: "Shift updated successfully" });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to update shift" });
    }
  }
};