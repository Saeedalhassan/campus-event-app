const cron = require('node-cron');
const pool = require('./db');
const { sendEventReminder } = require('./mailer');

const startReminderJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const result = await pool.query(`
        SELECT e.id, e.title, e.location, e.start_time,
               u.name, u.email
        FROM events e
        JOIN rsvps r ON e.id = r.event_id
        JOIN users u ON r.user_id = u.id
        WHERE e.start_time BETWEEN $1 AND $2
        AND r.status = 'going'
      `, [now, oneHourLater]);

      for (const row of result.rows) {
        try {
          await sendEventReminder(
            row.email,
            row.name,
            row.title,
            row.location,
            row.start_time
          );
          console.log(`Reminder sent to ${row.email} for ${row.title}`);
        } catch (err) {
          console.error(`Failed to send reminder to ${row.email}`);
        }
      }
    } catch (err) {
      console.error('Reminder job error:', err);
    }
  });

  console.log('Email reminder job started ✅');
};

module.exports = { startReminderJob };