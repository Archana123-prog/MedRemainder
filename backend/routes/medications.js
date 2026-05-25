const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const { protect } = require('../middleware/auth');

// GET all medications for user
router.get('/', protect, async (req, res) => {
  try {
    const meds = await Medication.find({ clerkUserId: req.userId }).sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create medication
router.post('/', protect, async (req, res) => {
  try {
    const med = await Medication.create({ ...req.body, clerkUserId: req.userId });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single medication
router.get('/:id', protect, async (req, res) => {
  try {
    const med = await Medication.findOne({ _id: req.params.id, clerkUserId: req.userId });
    if (!med) return res.status(404).json({ message: 'Medication not found' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update medication
router.put('/:id', protect, async (req, res) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, clerkUserId: req.userId },
      req.body, { new: true }
    );
    if (!med) return res.status(404).json({ message: 'Medication not found' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE medication
router.delete('/:id', protect, async (req, res) => {
  try {
    await Medication.findOneAndDelete({ _id: req.params.id, clerkUserId: req.userId });
    res.json({ message: 'Medication deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update pill count
router.patch('/:id/pills', protect, async (req, res) => {
  try {
    const { pillsRemaining } = req.body;
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, clerkUserId: req.userId },
      { pillsRemaining }, { new: true }
    );
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
