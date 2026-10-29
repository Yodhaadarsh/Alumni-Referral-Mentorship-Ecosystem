const admin = require('firebase-admin');
const User = require('../models/User');

let ready = false;
try {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (sa.project_id) { admin.initializeApp({ credential: admin.credential.cert(sa) }); ready = true; }
} catch { /* notifications disabled */ }

// Push a Firebase Cloud Messaging notification to a user (silently skipped if not configured).
module.exports = async (userId, title, body) => {
  if (!ready) return;
  const user = await User.findById(userId).select('fcmToken');
  if (!user?.fcmToken) return;
  try { await admin.messaging().send({ token: user.fcmToken, notification: { title, body } }); }
  catch (e) { console.warn('FCM failed:', e.message); }
};
