import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GalleryFolder from './models/GalleryFolder';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nss-vit-bhopal';

// Placeholder image for all auto-generated albums (using local frontend public asset)
const PLACEHOLDER_IMAGE = '/images/gallery/events_2025/image1.png';

const requestedFolders = [
  // Special Camps
  { title: 'Annual Unit NSS Camp', categoryId: 'camps' },
  { title: 'NSS Unit Camp 2025', categoryId: 'camps' },
  { title: 'Annual NSS Camp 2026', categoryId: 'camps' },
  { title: 'State NSS Camp', categoryId: 'camps' },
  { title: 'State NSS Camp (2026)', categoryId: 'camps' },
  { title: 'National Integration Camp NSS', categoryId: 'camps' },
  { title: 'District Pre-RDC Camp', categoryId: 'camps' },
  { title: 'BU Level Pre-RDC Camp', categoryId: 'camps' },
  { title: 'District Pre-RDC Camp (2025)', categoryId: 'camps' },
  { title: 'BU Level Pre-RDC Camp (2025)', categoryId: 'camps' },
  
  // Plantation & Environment
  { title: 'Plantation Drive', categoryId: 'plantation' },
  { title: 'NSS Mega Tree Plantation Drive', categoryId: 'plantation' },
  { title: 'Mega Tree Plantation Drive 2025', categoryId: 'plantation' },
  { title: 'Water and Food for Birds', categoryId: 'plantation' },
  { title: 'Water and Food for Birds 2025', categoryId: 'plantation' },
  { title: 'FIT India Rally', categoryId: 'plantation' },
  { title: 'Washroom Restoration', categoryId: 'plantation' },
  { title: 'Nukkad Natak (Plastic Free Campus)', categoryId: 'plantation' },
  
  // Blood Donation Drives
  { title: 'Blood Donation Camp', categoryId: 'blood' },
  { title: 'Blood Donation Camp (Year 2)', categoryId: 'blood' },
  { title: 'Blood Donation Camp (Year 3)', categoryId: 'blood' },
  { title: 'Blood Donation', categoryId: 'blood' },
  { title: 'Blood Donation 2026', categoryId: 'blood' },
  
  // Awareness Campaigns
  { title: 'Nukkad Natak', categoryId: 'awareness' },
  { title: 'Nukkad Natak – Women Empowerment', categoryId: 'awareness' },
  { title: 'National Youth Parliament', categoryId: 'awareness' },
  { title: 'National Youth Parliament 2025', categoryId: 'awareness' },
  { title: 'National Youth Parliament 2026', categoryId: 'awareness' },
  { title: 'Nodal District-Level Round of the Viksit Bharat Youth Parliament 2025', categoryId: 'awareness' },
  { title: 'Eye Check Up Camp', categoryId: 'awareness' },
  { title: 'Free Eye & Dental Checkup Camp', categoryId: 'awareness' },
  { title: 'Cloth Donation Drive', categoryId: 'awareness' },
  { title: 'Ambedkar Jayanti Celebration', categoryId: 'awareness' },
  
  // Youth Development
  { title: 'Orientation Program 2024', categoryId: 'youth' },
  { title: 'Orientation Program 2025', categoryId: 'youth' },
  { title: 'MANIT Visit', categoryId: 'youth' },
  { title: 'Convocation Volunteering', categoryId: 'youth' },
  { title: '5th Annual Convocation', categoryId: 'youth' },
  { title: 'Event of Home Minister', categoryId: 'youth' },
  { title: 'B-Certificate Examination 2026', categoryId: 'youth' },
  
  // Cultural Events
  { title: 'Har Ghar Tiranga', categoryId: 'cultural' },
  { title: 'Independence Day', categoryId: 'cultural' },
  { title: 'Republic Day Parade', categoryId: 'cultural' },
  { title: 'VIBGYOR', categoryId: 'cultural' },
  { title: 'UNGLI PE TILAK', categoryId: 'cultural' },
  { title: 'NSS Week (Swaccha Hi Seva)', categoryId: 'cultural' }
];

const seedGallery = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Update existing folders that have unsplash URLs to use local asset
    console.log('Updating existing folders to replace broken Unsplash URLs...');
    const result = await GalleryFolder.updateMany(
      { coverImage: { $regex: 'unsplash|placeholder', $options: 'i' } },
      { $set: { coverImage: PLACEHOLDER_IMAGE } }
    );
    console.log(`Updated ${result.modifiedCount} existing folders.`);

    // Ensure all folders exist
    let fakeDate = new Date();

    for (const folder of requestedFolders) {
      fakeDate.setDate(fakeDate.getDate() - 1);
      
      const existing = await GalleryFolder.findOne({ title: folder.title });
      if (!existing) {
        const newFolder = new GalleryFolder({
          title: folder.title,
          categoryId: folder.categoryId,
          coverImage: PLACEHOLDER_IMAGE,
          images: [],
          eventDate: new Date(fakeDate)
        });
        await newFolder.save();
        console.log(`Created: ${folder.title}`);
      }
    }

    console.log('\nSuccess! All folders updated with local placeholder images.');
  } catch (error) {
    console.error('Error seeding gallery:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedGallery();
