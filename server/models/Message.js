const { Schema, model } = require('mongoose');
module.exports = model('Message', new Schema({
  room: { type: String, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
}, { timestamps: true }));
