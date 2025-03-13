import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
