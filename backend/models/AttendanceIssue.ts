import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceIssue extends Document {
  userId: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  volunteerName: string;
  registrationNumber: string;
  email: string;
  batch?: string;
  issueType: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceIssueSchema = new Schema<IAttendanceIssue>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    volunteerName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    email: { type: String, required: true },
    batch: { type: String },
    issueType: { 
      type: String, 
      required: true,
      enum: ['MARKED_ABSENT_INSTEAD_OF_PRESENT', 'ATTENDANCE_NOT_MARKED', 'INCORRECT_HOURS', 'OTHER']
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RESOLVED', 'REJECTED'], default: 'PENDING' },
    adminRemarks: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IAttendanceIssue>('AttendanceIssue', AttendanceIssueSchema);
