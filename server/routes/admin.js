const router = require('express').Router();
const User = require('../models/User');
const Request = require('../models/MentorshipRequest');
const Referral = require('../models/Referral');
const Message = require('../models/Message');
const { auth, role } = require('../middleware/auth');

router.use(auth, role('admin'));

router.get('/stats', async (_, res) => {
  const [students, alumni, pending, accepted, referrals, messages, referralDocs] = await Promise.all([
    User.countDocuments({ role: 'student' }), User.countDocuments({ role: 'alumni' }),
    Request.countDocuments({ status: 'pending' }), Request.countDocuments({ status: 'accepted' }),
    Referral.countDocuments(), Message.countDocuments(), Referral.find().select('applicants.status'),
  ]);
  const applications = referralDocs.reduce((n, r) => n + r.applicants.length, 0);
  const referred = referralDocs.reduce((n, r) => n + r.applicants.filter(a => a.status === 'referred').length, 0);
  res.json({ students, alumni, pending, accepted, referrals, applications, referred, messages });
});

router.get('/users', async (_, res) =>
  res.json(await User.find({ role: { $ne: 'admin' } }).select('-password -fcmToken').sort('-createdAt')));

router.delete('/users/:id', async (req, res) => {
  await User.deleteOne({ _id: req.params.id, role: { $ne: 'admin' } });
  res.json({ ok: true });
});

module.exports = router;
