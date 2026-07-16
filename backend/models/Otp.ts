import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  mobileNumber: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // TTL index: Expires after 5 minutes (300s)
});

export default mongoose.model<IOtp>('Otp', OtpSchema);
