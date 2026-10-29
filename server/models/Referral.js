const { Schema, model } = require('mongoose');
module.exports = model('Referral', new Schema({
  alumni: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: { type: String, default: 'Referral' },
  description: String,
  requiredSkills: [String],
  applicants: [{
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    resumeUrl: String,
    status: { type: String, enum: ['applied', 'shortlisted', 'referred', 'rejected'], default: 'applied' },
  }],
}, { timestamps: true }));
