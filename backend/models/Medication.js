const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  genericName: { type: String },
  dosage: { type: String, required: true }, // e.g. "500mg"
  form: { type: String, enum: ['tablet', 'capsule', 'liquid', 'injection', 'patch', 'inhaler', 'drops', 'other'], default: 'tablet' },
  color: { type: String, default: '#6366f1' }, // for UI display
  instructions: { type: String }, // "Take with food", "Avoid alcohol"
  sideEffects: [{ type: String }],
  prescribedBy: { type: String }, // Doctor name
  pharmacy: { type: String },
  refillDate: { type: Date },
  totalPills: { type: Number },
  pillsRemaining: { type: Number },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medication', medicationSchema);
