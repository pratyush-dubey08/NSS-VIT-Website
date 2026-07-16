import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  category: string;
  fileUrl: string;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, default: 'document' },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IResource>('Resource', ResourceSchema);
