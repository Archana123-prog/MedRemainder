const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  frequency: {
    type: String,
    enum: ['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'every_x_hours', 'weekly', 'as_needed'],
    required: true
  },
  times: [{ type: String }], // ["08:00", "14:00", "20:00"]
  daysOfWeek: [{ type: Number }], // 0=Sun, 1=Mon... for weekly
  withFood: { type: Boolean, default: false },
  reminderMinutesBefore: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
