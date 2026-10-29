// Usage: node scripts/seed-admin.js admin@college.edu StrongPassword "Placement Cell"
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const [email, password, name = 'Admin'] = process.argv.slice(2);
if (!email || !password) { console.error('Usage: node scripts/seed-admin.js <email> <password> [name]'); process.exit(1); }
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.findOneAndUpdate({ email }, { name, email, role: 'admin', password: await bcrypt.hash(password, 10) }, { upsert: true });
  console.log('Admin ready:', email); process.exit(0);
});
