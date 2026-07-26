import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to Atlas successfully!');
  
  // List all databases
  const admin = mongoose.connection.db?.admin();
  if (admin) {
    const result = await admin.listDatabases();
    console.log('\n--- DATABASES ---');
    for (const db of result.databases) {
      console.log(`- ${db.name} (Size: ${db.sizeOnDisk} bytes)`);
      
      // If it's not local/admin/config, check its collections
      if (!['admin', 'local', 'config'].includes(db.name)) {
        const tempDb = mongoose.connection.useDb(db.name);
        const collections = await tempDb.db.listCollections().toArray();
        console.log(`  Collections in ${db.name}:`, collections.map(c => c.name).join(', '));
        
        for (const coll of collections) {
          const count = await tempDb.collection(coll.name).countDocuments();
          console.log(`    -> ${coll.name}: ${count} documents`);
        }
      }
    }
  }
  
  process.exit(0);
}
check().catch(console.error);
