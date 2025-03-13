import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Partner from '../models/partnerModel';
import Manager from '../models/managerModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const registerPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, areas } = req.body;

    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      res.status(400).json({ message: 'Partner already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPartner = new Partner({
      name,
      email,
      password: hashedPassword,
      phone,
      areas,
    });

    await newPartner.save();

    res.status(201).json({ message: 'Partner registered successfully' });
  } catch (error) {
    console.error('Failed to register partner:', error);
    res.status(500).json({ message: 'Failed to register partner' });
  }
};

export const registerManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      res.status(400).json({ message: 'Manager already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = new Manager({
      name,
      email,
      password: hashedPassword,
    });

    await newManager.save();

    res.status(201).json({ message: 'Manager registered successfully' });
  } catch (error) {
    console.error('Failed to register manager:', error);
    res.status(500).json({ message: 'Failed to register manager' });
  }
};

export const loginPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const partner = await Partner.findOne({ email });
    if (!partner || !partner.password) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: partner._id, role: 'partner' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, partner });
  } catch (error) {
    console.error('Failed to login partner:', error);
    res.status(500).json({ message: 'Failed to login partner' });
  }
};

export const loginManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const manager = await Manager.findOne({ email });
    if (!manager || !manager.password) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: manager._id, role: 'manager' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, manager });
  } catch (error) {
    console.error('Failed to login manager:', error);
    res.status(500).json({ message: 'Failed to login manager' });
  }
};

export const fetchPartner = async (_req: Request, res: Response) => {
  try {
    const token = _req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as any;
    const partner = await Partner.findById(decoded.id);

    if (!partner) {
      res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({
      _id: partner!._id,
      name: partner!.name,
      email: partner!.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get partner data' });
  }
};