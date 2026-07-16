import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PROGRAM_OFFICER = 'PROGRAM_OFFICER',
  EVENT_MANAGER = 'EVENT_MANAGER',
  VOLUNTEER = 'VOLUNTEER'
}

export interface IUser extends Document {
  registrationNumber: string;
  name: string;
  role: Role;
  email?: string;
  phoneNumber?: string;
  password?: string;
  batch?: string;
  gender?: string;
  residenceType?: string;
  academicYear?: string;
  volunteerId?: string;
  position?: string;
  linkedin?: string;
  accumulatedHours: number;
  bunks: number;
  certificates: string[];
  profilePhotoUrl?: string;
  registeredActivities: mongoose.Types.ObjectId[];
  participatedActivities: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  registrationNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.VOLUNTEER },
  email: { type: String, sparse: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String },
  batch: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  residenceType: { type: String, enum: ['Hosteller', 'Day Scholar'] },
  academicYear: { type: String },
  volunteerId: { type: String, unique: true, sparse: true },
  position: { type: String }, // e.g., 'Student Coordinator', 'Core Team Member'
  linkedin: { type: String },
  accumulatedHours: { type: Number, default: 0 },
  bunks: { type: Number, default: 0 },
  certificates: [{ type: String }],
  profilePhotoUrl: { type: String },
  registeredActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  participatedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
