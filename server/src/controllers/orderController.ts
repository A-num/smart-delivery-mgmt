import { Request, Response } from "express";
import Order from "../models/orderModel";
import { assignOrders } from "../services/assignmentService";
import { request } from "http";

export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log("order body", req.body)
    const newOrder = new Order(req.body);
    await newOrder.save();
    console.log("order saved")
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

export const getIncompleteOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: { $ne: "completed" } });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
