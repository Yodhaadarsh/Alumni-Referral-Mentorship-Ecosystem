// npm run seed : adds demo data to the database named in MONGO_URI (only if it has no users yet)
require('dotenv').config();
const mongoose = require('mongoose');
if (!process.env.MONGO_URI) { console.error('Set MONGO_URI in .env first. With the embedded database, demo data is added automatically on first start.'); process.exit(1); }
mongoose.connect(process.env.MONGO_URI).then(async () => { await require('../seed')(); process.exit(0); });
