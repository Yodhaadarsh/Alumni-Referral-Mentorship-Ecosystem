const { Schema, model } = require('mongoose');
module.exports = model('User', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
  branch: String,
  batch: Number,
  course: String,
  location: String,
  domain: String,
  linkedin: String,
  careerPath: String,
  company: String,        // alumni: current company | student: target company
  designation: String,
  skills: [String],
  interests: [String],
  openToMentor: { type: Boolean, default: true },
  fcmToken: String,
}, { timestamps: true }));
