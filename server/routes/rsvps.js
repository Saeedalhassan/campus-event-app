const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { createNotification } = require('../config/notifier');

router.post('/:eventId', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO rsvps (user_id, event_id, status) VALUES ($1,$2,$3) ON CONFLICT (user_id, event_id) DO UPDATE SET status=$3 RETURNING *',
      [req.user.id, req.params.eventId, status || 'going']
    );

    if (status === 'going') {
      const eventResult = await pool.query(
        'SELECT organizer_id, title FROM events WHERE id = $1',
        [req.params.eventId]
      );
      const event = eventResult.rows[0];
      const userResult = await pool.query(
        'SELECT name FROM users WHERE id = $1',
        [req.user.id]
      );
      const userName = userResult.rows[0].name;

      if (event && event.organizer_id !== req.user.id) {
        await createNotification(
          event.organizer_id,
          `✅ ${userName} is attending your event "${event.title}"`,
          `/events/${req.params.eventId}`
        );
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT r.*, u.name, u.email FROM rsvps r JOIN users u ON r.user_id = u.id WHERE r.event_id = $1',
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;