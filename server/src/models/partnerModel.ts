import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  currentLoad: { type: Number, default: 0 },
  areas: [String],
  shift: {
    start: String,
    end: String,
  },
  metrics: {
    rating: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
  },
});

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;
