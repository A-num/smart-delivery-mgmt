import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String
  },
  area: String,
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered'], default: 'pending' },
  scheduledFor: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
