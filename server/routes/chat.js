const router = require('express').Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

router.get('/:room', auth, async (req, res) => {
  if (!req.params.room.split('_').includes(String(req.user._id))) return res.status(403).json({ error: 'Forbidden' });
  res.json(await Message.find({ room: req.params.room }).sort('createdAt').limit(200));
});

module.exports = router;
