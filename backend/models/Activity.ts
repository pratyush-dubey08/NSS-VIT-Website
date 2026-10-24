import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  category: string;
  date: Date;
  venue: string;
  time?: string;
  bannerUrl?: string;
  formBannerUrl?: string;
  description: string;
  brief?: string;
  photos?: string[];
  objectives?: string;
  schedule?: string;
  participantLimit?: number;
  registrationDeadline?: Date;
  isRegistrationOpen: boolean;
  googleFormUrl?: string;
  registrationMode?: 'CUSTOM' | 'GOOGLE_FORM';
  eventManagers: mongoose.Types.ObjectId[];
  hoursAllocated: number;
  workingHours: number;
  formSchema?: any[];
  confirmationMessage?: string;
  isFormLockedForManagers?: boolean;
}

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  time: { type: String, default: '' },
  bannerUrl: { type: String },
  formBannerUrl: { type: String },
  description: { type: String, required: true },
  brief: { type: String },
  photos: [{ type: String }],
  objectives: { type: String },
  schedule: { type: String },
  participantLimit: { type: Number },
  registrationDeadline: { type: Date },
  isRegistrationOpen: { type: Boolean, default: true },
  googleFormUrl: { type: String, default: '' },
  registrationMode: { type: String, enum: ['CUSTOM', 'GOOGLE_FORM'], default: 'CUSTOM' },
  eventManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hoursAllocated: { type: Number, required: true, default: 0 },
  workingHours: { type: Number, default: 0 },
  formSchema: { type: [mongoose.Schema.Types.Mixed] },
  confirmationMessage: { type: String, default: "Thank you for filling out the form! Our team will contact you shortly." },
  isFormLockedForManagers: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
