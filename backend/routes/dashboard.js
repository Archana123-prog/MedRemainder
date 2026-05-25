const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const Schedule = require('../models/Schedule');
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');

// GET dashboard summary
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalMeds, activeMeds, todayLogs, weekStats] = await Promise.all([
      Medication.countDocuments({ clerkUserId: userId }),
      Medication.countDocuments({ clerkUserId: userId, isActive: true }),
      Log.find({ clerkUserId: userId, scheduledTime: { $gte: today, $lt: tomorrow } }).populate('medication'),
      Log.find({ clerkUserId: userId, scheduledTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    const takenToday = todayLogs.filter(l => l.status === 'taken').length;
    const pendingToday = todayLogs.filter(l => l.status === 'pending').length;
    const adherence7d = weekStats.length > 0
      ? Math.round((weekStats.filter(l => l.status === 'taken').length / weekStats.length) * 100)
      : 0;

    // Low pill alerts
    const lowPillMeds = await Medication.find({ clerkUserId: userId, isActive: true, pillsRemaining: { $lt: 5, $ne: null } });

    res.json({
      totalMeds, activeMeds, takenToday, pendingToday,
      adherence7d, todayLogs, lowPillAlerts: lowPillMeds
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
