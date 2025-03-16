import { Request, Response } from "express";
import Order from "../models/orderModel";
import { assignOrders } from "../services/assignmentService";
import { request } from "http";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    const result = await assignOrders();

    res.status(201).json({ order: newOrder, assignmentResult: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrdersByPartnerId = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find({ assignedTo: _req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


export const getActiveOrders = async (req: Request, res: Response) => {
  try {
    const partnerId = req.params.partnerId;

    const activeOrders = await Order.find({
      assignedTo: partnerId,
      status: { $in: ["pending", "assigned", "picked"] },
    });

    res.status(200).json(activeOrders);
  } catch (error) {
    console.error("Failed to fetch active orders:", error);
    res.status(500).json({ message: "Failed to fetch active orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("assignedTo");

    if (!order) {
       res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

