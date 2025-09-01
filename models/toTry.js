import mongoose from 'mongoose';

const toTrySchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  ownerName: { type: String, trim: true, default: "" },
  placeId: { type: String, trim: true, index: true },
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  lat: { type: Number },
  lng: { type: Number },
}, { timestamps: true });

const ToTry = mongoose.models.ToTry || mongoose.model('ToTry', toTrySchema);
export default ToTry;

