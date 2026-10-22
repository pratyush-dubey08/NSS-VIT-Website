import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GalleryFolder from './models/GalleryFolder';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nss-vit-bhopal';

// Placeholder image for all auto-generated albums (using local frontend public asset)
const PLACEHOLDER_IMAGE = '/images/gallery/events_2025/image1.png';

const seedGallery = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Update ALL folders whose coverImage is not starting with /images/
    console.log('Updating all folders to use reliable local placeholder image...');
    const result = await GalleryFolder.updateMany(
      { coverImage: { $not: { $regex: '^/images/' } } },
      { $set: { coverImage: PLACEHOLDER_IMAGE } }
    );
    console.log(`Updated ${result.modifiedCount} folders to local placeholder cover image.`);

    console.log('\nSuccess! All folders updated with local placeholder images.');
  } catch (error) {
    console.error('Error seeding gallery:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedGallery();
