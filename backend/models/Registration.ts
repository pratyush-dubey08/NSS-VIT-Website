import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistrationResponse {
  fieldId: string;
  value: any;
}

export interface IRegistration extends Document {
  activityId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  fullName?: string;
  email?: string;
  registrationNumber?: string;
  phoneNumber?: string;
  responses: IRegistrationResponse[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attendanceStatus: 'PENDING' | 'ATTENDED' | 'BUNKED';
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationResponseSchema = new Schema({
  fieldId: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
});

const RegistrationSchema: Schema = new Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  fullName: { type: String },
  email: { type: String, lowercase: true, trim: true },
  registrationNumber: { type: String, uppercase: true, trim: true },
  phoneNumber: { type: String },
  responses: [RegistrationResponseSchema],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  attendanceStatus: { type: String, enum: ['PENDING', 'ATTENDED', 'BUNKED'], default: 'PENDING' },
  certificateUrl: { type: String }
}, {
  timestamps: true
});

// Indices
RegistrationSchema.index({ activityId: 1, email: 1 });
RegistrationSchema.index({ activityId: 1, userId: 1 });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
