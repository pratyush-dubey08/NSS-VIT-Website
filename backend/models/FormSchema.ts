import mongoose, { Document, Schema } from 'mongoose';

export enum FieldType {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
  REG_NUMBER = 'REG_NUMBER',
  DEPARTMENT = 'DEPARTMENT',
  YEAR = 'YEAR',
  DROPDOWN = 'DROPDOWN',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
  FILE_UPLOAD = 'FILE_UPLOAD',
  DECLARATION = 'DECLARATION'
}

export interface IFormField {
  id: string; // Unique ID for frontend rendering/drag-and-drop
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[]; // For dropdown, radio, checkbox
  placeholder?: string;
  order: number;
}

export interface IFormSchema extends Document {
  activityId: mongoose.Types.ObjectId;
  fields: IFormField[];
  isActive: boolean;
}

const FormFieldSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(FieldType), required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  placeholder: { type: String },
  order: { type: Number, required: true }
});

const FormSchemaSchema: Schema = new Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true, unique: true },
  fields: [FormFieldSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IFormSchema>('FormSchema', FormSchemaSchema);
