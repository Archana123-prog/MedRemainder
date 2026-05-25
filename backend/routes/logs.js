const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const Medication = require('../models/Medication');
const { protect } = require('../middleware/auth');

// GET all logs (with optional date filter)
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, medicationId } = req.query;
    const filter = { user: req.user._id };
    if (medicationId) filter.medication = medicationId;
    if (startDate || endDate) {
      filter.scheduledTime = {};
      if (startDate) filter.scheduledTime.$gte = new Date(startDate);
      if (endDate) filter.scheduledTime.$lte = new Date(endDate);
    }
    const logs = await Log.find(filter).populate('medication').sort({ scheduledTime: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST log a dose
router.post('/', protect, async (req, res) => {
  try {
    const log = await Log.create({ ...req.body, user: req.user._id });
    // If taken, decrement pill count
    if (req.body.status === 'taken' && req.body.medication) {
      await Medication.findByIdAndUpdate(
        req.body.medication,
        { $inc: { pillsRemaining: -1 } }
      );
    }
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update log status (mark taken/missed/skipped)
router.patch('/:id', protect, async (req, res) => {
  try {
    const log = await Log.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, takenAt: req.body.status === 'taken' ? new Date() : undefined },
      { new: true }
    ).populate('medication');
    if (!log) return res.status(404).json({ message: 'Log not found' });

    if (req.body.status === 'taken') {
      await Medication.findByIdAndUpdate(log.medication._id, { $inc: { pillsRemaining: -1 } });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET adherence stats
router.get('/stats', protect, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const logs = await Log.find({ user: req.user._id, scheduledTime: { $gte: since } });
    const total = logs.length;
    const taken = logs.filter(l => l.status === 'taken').length;
    const missed = logs.filter(l => l.status === 'missed').length;
    const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

    res.json({ total, taken, missed, adherenceRate, period: `${days} days` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
