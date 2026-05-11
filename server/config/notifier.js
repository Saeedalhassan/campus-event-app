const pool = require('./db');

const createNotification = async (userId, message, link = null) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, message, link) VALUES ($1, $2, $3)',
      [userId, message, link]
    );
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { createNotification };