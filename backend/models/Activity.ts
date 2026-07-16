import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  category: string;
  date: Date;
  venue: string;
  bannerUrl?: string;
  description: string;
  brief?: string;
  photos?: string[];
  objectives?: string;
  schedule?: string;
  participantLimit?: number;
  registrationDeadline?: Date;
  isRegistrationOpen: boolean;
  eventManagers: mongoose.Types.ObjectId[];
  hoursAllocated: number;
  workingHours: number;
  formSchema?: any[];
}

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  bannerUrl: { type: String },
  description: { type: String, required: true },
  brief: { type: String },
  photos: [{ type: String }],
  objectives: { type: String },
  schedule: { type: String },
  participantLimit: { type: Number },
  registrationDeadline: { type: Date },
  isRegistrationOpen: { type: Boolean, default: true },
  eventManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hoursAllocated: { type: Number, required: true, default: 0 },
  workingHours: { type: Number, default: 0 },
  formSchema: { type: [mongoose.Schema.Types.Mixed] }
}, {
  timestamps: true
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
