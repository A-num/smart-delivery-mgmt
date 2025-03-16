import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true},
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
