const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Connects to MongoDB.
//  - MONGO_URI set (local MongoDB or Atlas): uses it.
//  - MONGO_URI empty: starts an embedded MongoDB that keeps its files in server/data,
//    so nothing needs to be installed. (The first run downloads the MongoDB binary once.)
module.exports = async function connectDB() {
  let uri = (process.env.MONGO_URI || '').trim();
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.join(__dirname, 'data');
    fs.mkdirSync(dbPath, { recursive: true });
    console.log('No MONGO_URI set: starting embedded MongoDB (data saved in server/data). First run may take a minute to download.');
    const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } });
    uri = mongod.getUri('alumni_ecosystem');
    const stop = async () => { await mongoose.disconnect().catch(() => {}); await mongod.stop({ doCleanup: false }).catch(() => {}); process.exit(0); };
    process.on('SIGINT', stop); process.on('SIGTERM', stop);
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('MongoDB connected');
};
