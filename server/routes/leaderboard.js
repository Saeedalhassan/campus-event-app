const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET LEADERBOARD
router.get('/', async (req, res) => {
  try {
    const topOrganizers = await pool.query(`
      SELECT u.id, u.name, u.avatar_url, u.role,
        COUNT(DISTINCT e.id) as events_created,
        COUNT(DISTINCT r.id) as total_rsvps,
        COUNT(DISTINCT l.id) as total_likes,
        COUNT(DISTINCT f.id) as total_followers
      FROM users u
      LEFT JOIN events e ON e.organizer_id = u.id
      LEFT JOIN rsvps r ON r.event_id = e.id
      LEFT JOIN event_likes l ON l.event_id = e.id
      LEFT JOIN follows f ON f.following_id = u.id
      GROUP BY u.id, u.name, u.avatar_url, u.role
      ORDER BY events_created DESC, total_rsvps DESC
      LIMIT 10
    `);

    const topAttendees = await pool.query(`
      SELECT u.id, u.name, u.avatar_url, u.role,
        COUNT(DISTINCT r.id) as events_attended,
        COUNT(DISTINCT c.id) as total_comments,
        COUNT(DISTINCT l.id) as total_likes_given,
        COUNT(DISTINCT f.id) as total_following
      FROM users u
      LEFT JOIN rsvps r ON r.user_id = u.id AND r.status = 'going'
      LEFT JOIN comments c ON c.user_id = u.id
      LEFT JOIN event_likes l ON l.user_id = u.id
      LEFT JOIN follows f ON f.follower_id = u.id
      GROUP BY u.id, u.name, u.avatar_url, u.role
      ORDER BY events_attended DESC, total_comments DESC
      LIMIT 10
    `);

    res.json({
      topOrganizers: topOrganizers.rows,
      topAttendees: topAttendees.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;