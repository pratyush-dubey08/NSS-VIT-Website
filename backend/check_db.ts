import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to Atlas');
  console.log('Database Name:', mongoose.connection.db?.databaseName);
  
  const collections = await mongoose.connection.db?.listCollections().toArray();
  console.log('Collections:', collections?.map(c => c.name));
  
  const activities = await mongoose.connection.db?.collection('activities').find().toArray();
  console.log('Total activities in Atlas:', activities?.length);
  process.exit(0);
}
check();
