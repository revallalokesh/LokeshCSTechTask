import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema({
  firstName: String, phone: String, notes: String
});
const AgentSchema = new mongoose.Schema({
  name: String, email: String, mobileWithCountry: String,
  passwordHash: String,
  assignedTasks: [TaskSchema]
});
export default mongoose.model('Agent', AgentSchema);
