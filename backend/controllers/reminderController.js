const nodemailer = require('nodemailer');
const Schedule = require('../models/Schedule');
const Log = require('../models/Log');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const schedules = await Schedule.find({ isActive: true }).populate('medication').populate('user');

    for (const schedule of schedules) {
      for (const time of schedule.times) {
        const [h, m] = time.split(':').map(Number);
        const reminderTime = new Date(now);
        reminderTime.setHours(h, m - (schedule.reminderMinutesBefore || 15), 0, 0);

        const diff = Math.abs(now - reminderTime) / 60000;
        if (diff < 1) {
          // Send email reminder
          const user = schedule.user;
          if (user.reminderMethod !== 'none' && user.email) {
            await transporter.sendMail({
              from: `MedRemind 💊 <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: `⏰ Reminder: Time to take ${schedule.medication.name}`,
              html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
                  <h2 style="color:#6366f1;">💊 MedRemind</h2>
                  <p>Hi <strong>${user.name}</strong>,</p>
                  <p>It's almost time to take your medication:</p>
                  <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #6366f1;">
                    <strong>${schedule.medication.name}</strong> — ${schedule.medication.dosage}<br>
                    <small>${schedule.medication.instructions || ''}</small>
                  </div>
                  <p>Scheduled for: <strong>${time}</strong></p>
                  ${schedule.withFood ? '<p>🍽️ Remember to take with food!</p>' : ''}
                  <p style="color:#94a3b8;font-size:12px;">MedRemind - Your Smart Prescription Manager</p>
                </div>
              `
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Reminder error:', err.message);
  }
};

module.exports = { checkAndSendReminders };
