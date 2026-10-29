const router = require('express').Router();
const Request = require('../models/MentorshipRequest');
const User = require('../models/User');
const { auth, role } = require('../middleware/auth');
const notify = require('../utils/notify');
const createMeet = require('../utils/meet');

router.post('/', auth, role('student'), async (req, res) => {
  const { alumni, message } = req.body;
  const r = await Request.create({ student: req.user._id, alumni, message });
  notify(alumni, 'New mentorship request', `${req.user.name} wants your guidance`);
  res.json(r);
});

router.get('/mine', auth, async (req, res) => {
  const field = req.user.role === 'alumni' ? 'alumni' : 'student';
  const list = await Request.find({ [field]: req.user._id })
    .populate('student alumni', 'name email company designation').sort('-createdAt');
  res.json(list);
});

// Alumni accepts + schedules => Google Meet link generated and student notified
router.patch('/:id/accept', auth, role('alumni'), async (req, res) => {
  const r = await Request.findOne({ _id: req.params.id, alumni: req.user._id });
  if (!r) return res.status(404).json({ error: 'Not found' });
  const student = await User.findById(r.student);
  r.status = 'accepted';
  r.scheduledAt = req.body.scheduledAt;
  try {
    r.meetLink = await createMeet({
      summary: `Mentorship: ${student.name} & ${req.user.name}`,
      start: r.scheduledAt, attendees: [student.email, req.user.email],
    });
  } catch (e) { console.warn('Meet creation failed:', e.message); }
  await r.save();
  notify(r.student, 'Mentorship accepted', `${req.user.name} scheduled a session`);
  res.json(r);
});

router.patch('/:id/reject', auth, role('alumni'), async (req, res) => {
  const r = await Request.findOneAndUpdate({ _id: req.params.id, alumni: req.user._id }, { status: 'rejected' }, { new: true });
  if (r) notify(r.student, 'Mentorship update', 'Your request was declined');
  res.json(r);
});

module.exports = router;
