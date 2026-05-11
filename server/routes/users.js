const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET USER PROFILE
router.get('/:id', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!user.rows[0]) return res.status(404).json({ message: 'User not found' });

    const events = await pool.query(
      'SELECT * FROM events WHERE organizer_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );

    const rsvps = await pool.query(
      `SELECT e.*, r.status FROM rsvps r 
       JOIN events e ON r.event_id = e.id 
       WHERE r.user_id = $1 AND r.status = 'going'
       ORDER BY e.start_time ASC`,
      [req.params.id]
    );

    res.json({
      user: user.rows[0],
      events: events.rows,
      rsvps: rsvps.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROFILE
router.put('/update', auth, async (req, res) => {
  const { name, bio, avatar_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, bio=$2, avatar_url=$3 WHERE id=$4 RETURNING id, name, email, role, avatar_url, bio',
      [name, bio, avatar_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;