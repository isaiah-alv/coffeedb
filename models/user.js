import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

