const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { createNotification } = require('../config/notifier');

// TOGGLE FOLLOW
router.post('/:userId', auth, async (req, res) => {
  if (req.user.id === req.params.userId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }
  try {
    const existing = await pool.query(
      'SELECT id FROM follows WHERE follower_id=$1 AND following_id=$2',
      [req.user.id, req.params.userId]
    );

    if (existing.rows[0]) {
      await pool.query(
        'DELETE FROM follows WHERE follower_id=$1 AND following_id=$2',
        [req.user.id, req.params.userId]
      );
      res.json({ following: false });
    } else {
      await pool.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1,$2)',
        [req.user.id, req.params.userId]
      );

      const follower = await pool.query(
        'SELECT name FROM users WHERE id=$1',
        [req.user.id]
      );

      await createNotification(
        req.params.userId,
        `👥 ${follower.rows[0].name} started following you!`,
        `/profile/${req.user.id}`
      );

      res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET FOLLOW STATUS
router.get('/status/:userId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM follows WHERE follower_id=$1 AND following_id=$2',
      [req.user.id, req.params.userId]
    );
    const followers = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id=$1',
      [req.params.userId]
    );
    const following = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id=$1',
      [req.params.userId]
    );
    res.json({
      following: !!result.rows[0],
      followers: parseInt(followers.rows[0].count),
      following_count: parseInt(following.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET FOLLOWERS
router.get('/followers/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.avatar_url, u.role
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id=$1`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET FOLLOWING
router.get('/following/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.avatar_url, u.role
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id=$1`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;