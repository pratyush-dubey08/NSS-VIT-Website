import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/nss-vit-bhopal';
const ATLAS_URI = process.env.MONGODB_URI as string;

async function migrate() {
  if (!ATLAS_URI || ATLAS_URI.includes('fL7SFtg1Ty0rU9b3') || !ATLAS_URI.includes('mongodb+srv')) {
    console.log('Please update your ATLAS_URI in .env with your new password first!');
    process.exit(1);
  }

  console.log('Connecting to Local DB...');
  const localDb = mongoose.createConnection(LOCAL_URI);
  
  console.log('Connecting to Atlas DB...');
  const atlasDb = mongoose.createConnection(ATLAS_URI);

  await Promise.all([
    new Promise(resolve => localDb.once('open', resolve)),
    new Promise(resolve => atlasDb.once('open', resolve))
  ]);

  console.log('Both databases connected!');

  const collectionsToMigrate = ['users', 'activities', 'registrations', 'forms', 'resources'];

  for (const collName of collectionsToMigrate) {
    console.log(`Migrating ${collName}...`);
    const localCollection = localDb.collection(collName);
    const atlasCollection = atlasDb.collection(collName);

    const docs = await localCollection.find({}).toArray();
    if (docs.length > 0) {
      // Clear atlas collection first to avoid duplicates
      await atlasCollection.deleteMany({});
      await atlasCollection.insertMany(docs);
      console.log(`✅ Migrated ${docs.length} documents for ${collName}`);
    } else {
      console.log(`⚠️ No documents found in ${collName}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(console.error);
