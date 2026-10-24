import mongoose, { Document, Schema } from 'mongoose';

export interface IVolunteerForm extends Document {
  title: string;
  titleBold?: boolean;
  titleItalic?: boolean;
  titleUnderline?: boolean;
  titleColor?: string;
  description: string;
  descriptionBold?: boolean;
  descriptionItalic?: boolean;
  descriptionUnderline?: boolean;
  descriptionColor?: string;
  googleFormUrl: string;
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerFormSchema = new Schema<IVolunteerForm>(
  {
    title: { type: String, required: true },
    titleBold: { type: Boolean, default: false },
    titleItalic: { type: Boolean, default: false },
    titleUnderline: { type: Boolean, default: false },
    titleColor: { type: String, default: '#111827' },
    description: { type: String, default: '' },
    descriptionBold: { type: Boolean, default: false },
    descriptionItalic: { type: Boolean, default: false },
    descriptionUnderline: { type: Boolean, default: false },
    descriptionColor: { type: String, default: '#4b5563' },
    googleFormUrl: { type: String, required: true },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IVolunteerForm>('VolunteerForm', VolunteerFormSchema);
