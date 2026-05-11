const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET RATINGS FOR EVENT
router.get('/:eventId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name, u.avatar_url 
       FROM event_ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.eventId]
    );
    const avgResult = await pool.query(
      'SELECT AVG(rating) as average, COUNT(*) as total FROM event_ratings WHERE event_id = $1',
      [req.params.eventId]
    );
    res.json({
      ratings: result.rows,
      average: parseFloat(avgResult.rows[0].average) || 0,
      total: parseInt(avgResult.rows[0].total)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD OR UPDATE RATING
router.post('/:eventId', auth, async (req, res) => {
  const { rating, review } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO event_ratings (user_id, event_id, rating, review)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, event_id)
       DO UPDATE SET rating=$3, review=$4
       RETURNING *`,
      [req.user.id, req.params.eventId, rating, review]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER RATING FOR EVENT
router.get('/:eventId/my-rating', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM event_ratings WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.eventId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;