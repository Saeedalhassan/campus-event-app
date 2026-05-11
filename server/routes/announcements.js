const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { createNotification } = require('../config/notifier');

// GET ANNOUNCEMENTS FOR EVENT
router.get('/:eventId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name as organizer_name 
       FROM announcements a
       JOIN users u ON a.organizer_id = u.id
       WHERE a.event_id = $1
       ORDER BY a.created_at DESC`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE ANNOUNCEMENT
router.post('/:eventId', auth, async (req, res) => {
  const { message } = req.body;
  try {
    const eventResult = await pool.query(
      'SELECT * FROM events WHERE id=$1 AND organizer_id=$2',
      [req.params.eventId, req.user.id]
    );
    if (!eventResult.rows[0]) {
      return res.status(403).json({ message: 'Only organizer can post announcements' });
    }

    const result = await pool.query(
      'INSERT INTO announcements (event_id, organizer_id, message) VALUES ($1,$2,$3) RETURNING *',
      [req.params.eventId, req.user.id, message]
    );

    const attendees = await pool.query(
      `SELECT DISTINCT u.id, u.name 
       FROM rsvps r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.event_id=$1 AND r.status='going' AND r.user_id != $2`,
      [req.params.eventId, req.user.id]
    );

    for (const attendee of attendees.rows) {
      await createNotification(
        attendee.id,
        `📢 New announcement for "${eventResult.rows[0].title}": ${message.substring(0, 50)}...`,
        `/events/${req.params.eventId}`
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ANNOUNCEMENT
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM announcements WHERE id=$1 AND organizer_id=$2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;