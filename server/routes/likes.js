const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { createNotification } = require('../config/notifier');

// TOGGLE LIKE
router.post('/like/:eventId', auth, async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM event_likes WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.eventId]
    );

    if (existing.rows[0]) {
      await pool.query(
        'DELETE FROM event_likes WHERE user_id=$1 AND event_id=$2',
        [req.user.id, req.params.eventId]
      );
      res.json({ liked: false });
    } else {
      await pool.query(
        'INSERT INTO event_likes (user_id, event_id) VALUES ($1, $2)',
        [req.user.id, req.params.eventId]
      );

      const eventResult = await pool.query(
        'SELECT organizer_id, title FROM events WHERE id=$1',
        [req.params.eventId]
      );
      const event = eventResult.rows[0];
      const userResult = await pool.query(
        'SELECT name FROM users WHERE id=$1',
        [req.user.id]
      );

      if (event && event.organizer_id !== req.user.id) {
        await createNotification(
          event.organizer_id,
          `❤️ ${userResult.rows[0].name} liked your event "${event.title}"`,
          `/events/${req.params.eventId}`
        );
      }

      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE SAVE
router.post('/save/:eventId', auth, async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM saved_events WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.eventId]
    );

    if (existing.rows[0]) {
      await pool.query(
        'DELETE FROM saved_events WHERE user_id=$1 AND event_id=$2',
        [req.user.id, req.params.eventId]
      );
      res.json({ saved: false });
    } else {
      await pool.query(
        'INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2)',
        [req.user.id, req.params.eventId]
      );
      res.json({ saved: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET LIKE/SAVE STATUS
router.get('/status/:eventId', auth, async (req, res) => {
  try {
    const liked = await pool.query(
      'SELECT id FROM event_likes WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.eventId]
    );
    const saved = await pool.query(
      'SELECT id FROM saved_events WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.eventId]
    );
    const likeCount = await pool.query(
      'SELECT COUNT(*) FROM event_likes WHERE event_id=$1',
      [req.params.eventId]
    );
    res.json({
      liked: !!liked.rows[0],
      saved: !!saved.rows[0],
      likeCount: parseInt(likeCount.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SAVED EVENTS FOR USER
router.get('/saved', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name 
       FROM saved_events s
       JOIN events e ON s.event_id = e.id
       JOIN users u ON e.organizer_id = u.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;