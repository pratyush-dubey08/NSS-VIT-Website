import mongoose from 'mongoose';
import Activity from './backend/models/Activity';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to Atlas');
  const activities = await Activity.find();
  console.log('Total activities in Atlas:', activities.length);
  process.exit(0);
}
check();
