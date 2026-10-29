const router = require('express').Router();
const User = require('../models/User');
const { auth, role } = require('../middleware/auth');
const { score } = require('../utils/match');

// Search alumni by name / company / skill
router.get('/', auth, async (req, res) => {
  const { q = '' } = req.query;
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const list = await User.find({ role: 'alumni', openToMentor: true,
    $or: [{ name: rx }, { company: rx }, { skills: rx }, { designation: rx }] })
    .select('-password -fcmToken').limit(50);
  res.json(list);
});

// Ranked top-5 shortlist for the logged-in student
router.get('/match', auth, role('student'), async (req, res) => {
  const alumni = await User.find({ role: 'alumni', openToMentor: true }).select('-password -fcmToken');
  const ranked = alumni.map(a => ({ alumni: a, score: score(req.user, a) }))
    .sort((x, y) => y.score - x.score).slice(0, 5);
  res.json(ranked);
});

module.exports = router;
