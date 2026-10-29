const router = require('express').Router();
const Referral = require('../models/Referral');
const { auth, role } = require('../middleware/auth');
const notify = require('../utils/notify');

router.post('/', auth, role('alumni'), async (req, res) =>
  res.json(await Referral.create({ ...req.body, alumni: req.user._id })));

// Applicants come back with the student's name so alumni can see who applied
router.get('/', auth, async (req, res) => {
  const list = await Referral.find().populate('alumni', 'name company designation').populate('applicants.student', 'name').sort('-createdAt');
  res.json(list.map(r => { const o = r.toObject();
    o.applicants = o.applicants.map(a => ({ ...a, studentName: a.student?.name, student: String(a.student?._id || a.student) })); return o; }));
});

router.post('/:id/apply', auth, role('student'), async (req, res) => {
  const ref = await Referral.findById(req.params.id);
  if (!ref) return res.status(404).json({ error: 'Not found' });
  if (ref.applicants.some(a => a.student.equals(req.user._id))) return res.status(400).json({ error: 'Already applied' });
  ref.applicants.push({ student: req.user._id, resumeUrl: req.body.resumeUrl });
  await ref.save();
  notify(ref.alumni, 'New referral application', `${req.user.name} applied for ${ref.title}`);
  res.json(ref);
});

router.patch('/:id/applicants/:studentId', auth, role('alumni'), async (req, res) => {
  const ref = await Referral.findOne({ _id: req.params.id, alumni: req.user._id });
  const app = ref?.applicants.find(a => a.student.equals(req.params.studentId));
  if (!app) return res.status(404).json({ error: 'Not found' });
  app.status = req.body.status;
  await ref.save();
  notify(app.student, 'Referral update', `Your application for ${ref.title} is now ${app.status}`);
  res.json(ref);
});

module.exports = router;
