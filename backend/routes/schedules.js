const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const schedules = await Schedule.find({ clerkUserId: req.userId }).populate('medication');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const schedule = await Schedule.create({ ...req.body, clerkUserId: req.userId });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const schedules = await Schedule.find({
      clerkUserId: req.userId, isActive: true,
      $or: [{ daysOfWeek: { $size: 0 } }, { daysOfWeek: dayOfWeek }]
    }).populate('medication');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, clerkUserId: req.userId },
      req.body, { new: true }
    ).populate('medication');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Schedule.findOneAndDelete({ _id: req.params.id, clerkUserId: req.userId });
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
