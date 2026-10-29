const router = require('express').Router();
const User = require('../models/User');
const Referral = require('../models/Referral');

// Public data for the landing page: no login needed, no private fields
router.get('/overview', async (_, res) => {
  const alumni = await User.find({ role: 'alumni', openToMentor: true })
    .select('name designation company batch course location domain careerPath linkedin skills').sort('-createdAt').limit(60);
  const refs = await Referral.find().populate('alumni', 'name').sort('-createdAt').limit(6);
  res.json({ alumni, opportunities: refs.map(r => ({ id: r._id, title: r.title, company: r.company, location: r.location, type: r.type, by: r.alumni?.name })) });
});

module.exports = router;
