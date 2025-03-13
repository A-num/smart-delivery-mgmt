import Partner from '../models/partnerModel';
import Order from '../models/orderModel';

export const assignOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) return { success: false, reason: 'Order not found' };

  const currentTime = new Date().toISOString().slice(11, 16);

  const availablePartners = await Partner.find({
    status: 'active',
    currentLoad: { $lt: 3 },
    areas: order.area,
    'shift.start': { $lte: currentTime },
    'shift.end': { $gte: currentTime }
  });

  if (availablePartners.length === 0) {
    return { success: false, reason: 'No available partners' };
  }

  availablePartners.sort((a, b) => a.currentLoad - b.currentLoad || (b.metrics?.rating ?? 0) - (a.metrics?.rating ?? 0));

  const selectedPartner = availablePartners[0];
  order.assignedTo = selectedPartner._id;
  order.status = 'assigned';
  selectedPartner.currentLoad += 1;

  await order.save();
  await selectedPartner.save();

  return { success: true, assignedTo: selectedPartner._id };
};
