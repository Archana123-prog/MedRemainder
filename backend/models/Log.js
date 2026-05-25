const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  scheduledTime: { type: Date, required: true },
  takenAt: { type: Date },
  status: { type: String, enum: ['taken', 'missed', 'skipped', 'pending'], default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
