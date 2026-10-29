const { Schema, model } = require('mongoose');
module.exports = model('MentorshipRequest', new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  alumni: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  scheduledAt: Date,
  meetLink: String,
}, { timestamps: true }));
