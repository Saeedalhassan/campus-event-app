const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/:eventId', auth, async (req, res) => {
  try {
    const eventCheck = await pool.query(
      'SELECT * FROM events WHERE id=$1 AND organizer_id=$2',
      [req.params.eventId, req.user.id]
    );
    if (!eventCheck.rows[0]) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const views = await pool.query(
      'SELECT COUNT(*) FROM event_views WHERE event_id=$1',
      [req.params.eventId]
    );
    const uniqueViews = await pool.query(
      'SELECT COUNT(DISTINCT user_id) FROM event_views WHERE event_id=$1',
      [req.params.eventId]
    );
    const rsvps = await pool.query(
      'SELECT status, COUNT(*) FROM rsvps WHERE event_id=$1 GROUP BY status',
      [req.params.eventId]
    );
    const likes = await pool.query(
      'SELECT COUNT(*) FROM event_likes WHERE event_id=$1',
      [req.params.eventId]
    );
    const comments = await pool.query(
      'SELECT COUNT(*) FROM comments WHERE event_id=$1',
      [req.params.eventId]
    );
    const ratings = await pool.query(
      'SELECT AVG(rating) as average, COUNT(*) as total FROM event_ratings WHERE event_id=$1',
      [req.params.eventId]
    );
    const saves = await pool.query(
      'SELECT COUNT(*) FROM saved_events WHERE event_id=$1',
      [req.params.eventId]
    );

    const viewsByDay = await pool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count 
       FROM event_views WHERE event_id=$1 
       GROUP BY DATE(viewed_at) 
       ORDER BY date DESC LIMIT 7`,
      [req.params.eventId]
    );

    const rsvpMap = {};
    rsvps.rows.forEach(r => { rsvpMap[r.status] = parseInt(r.count); });

    res.json({
      views: parseInt(views.rows[0].count),
      uniqueViews: parseInt(uniqueViews.rows[0].count),
      going: rsvpMap['going'] || 0,
      maybe: rsvpMap['maybe'] || 0,
      not_going: rsvpMap['not_going'] || 0,
      likes: parseInt(likes.rows[0].count),
      comments: parseInt(comments.rows[0].count),
      saves: parseInt(saves.rows[0].count),
      avgRating: parseFloat(ratings.rows[0].average) || 0,
      totalRatings: parseInt(ratings.rows[0].total),
      viewsByDay: viewsByDay.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;