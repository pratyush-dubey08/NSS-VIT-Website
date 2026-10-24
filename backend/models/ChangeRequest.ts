import mongoose, { Schema, Document } from 'mongoose';

export interface IChangeRequest extends Document {
  user: mongoose.Types.ObjectId;
  volunteerName: string;
  registrationNumber: string;
  email: string;
  field: string;
  currentValue: string;
  requestedValue: string;
  reason?: string;
  status: 'Pending' | 'Accepted';
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const changeRequestSchema = new Schema<IChangeRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    volunteerName: {
      type: String,
      required: true
    },
    registrationNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    currentValue: {
      type: String,
      default: ''
    },
    requestedValue: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted'],
      default: 'Pending'
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IChangeRequest>('ChangeRequest', changeRequestSchema);
