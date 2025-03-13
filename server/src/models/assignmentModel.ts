import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  reason: { type: String, default: null },
  status: { type: String, enum: ['success', 'pending', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  completed_at: { type: Date, default: Date.now }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
