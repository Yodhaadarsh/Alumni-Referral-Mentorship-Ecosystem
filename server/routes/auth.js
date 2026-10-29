const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const clean = u => { const o = u.toObject(); delete o.password; return o; };

router.post('/register', async (req, res) => {
  try {
    const { password, role, ...rest } = req.body;
    if (!['student', 'alumni'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.create({ ...rest, role, password: await bcrypt.hash(password, 10) });
    res.json({ token: sign(user), user: clean(user) });
  } catch (e) { res.status(400).json({ error: e.code === 11000 ? 'Email already registered' : e.message }); }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ token: sign(user), user: clean(user) });
});

router.get('/me', auth, (req, res) => res.json(req.user));
router.put('/me', auth, async (req, res) => {
  const { name, branch, batch, course, location, domain, linkedin, careerPath, company, designation, skills, interests, openToMentor, fcmToken } = req.body;
  const u = await User.findByIdAndUpdate(req.user._id,
    { name, branch, batch, course, location, domain, linkedin, careerPath, company, designation, skills, interests, openToMentor, fcmToken },
    { new: true, omitUndefined: true }).select('-password');
  res.json(u);
});

module.exports = router;
