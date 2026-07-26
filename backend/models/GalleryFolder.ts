import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryFolder extends Document {
  title: string;
  categoryId: string; // 'camps', 'plantation', 'blood', 'awareness', 'youth', 'cultural'
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GalleryFolderSchema: Schema = new Schema({
  title: { type: String, required: true },
  categoryId: { type: String, required: true },
  coverImage: { type: String, required: true },
  images: [{ type: String }],
}, {
  timestamps: true
});

export default mongoose.model<IGalleryFolder>('GalleryFolder', GalleryFolderSchema);
