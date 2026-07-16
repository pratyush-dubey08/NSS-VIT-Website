import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistrationResponse {
  fieldId: string;
  value: any;
}

export interface IRegistration extends Document {
  activityId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  responses: IRegistrationResponse[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attendanceStatus: 'PENDING' | 'ATTENDED' | 'BUNKED';
}

const RegistrationResponseSchema = new Schema({
  fieldId: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
});

const RegistrationSchema: Schema = new Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [RegistrationResponseSchema],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  attendanceStatus: { type: String, enum: ['PENDING', 'ATTENDED', 'BUNKED'], default: 'PENDING' }
}, {
  timestamps: true
});

// Ensure a user can only register once for an activity
RegistrationSchema.index({ activityId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
