const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET STATS
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const events = await pool.query('SELECT COUNT(*) FROM events');
    const rsvps = await pool.query('SELECT COUNT(*) FROM rsvps');
    const comments = await pool.query('SELECT COUNT(*) FROM comments');

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalEvents: parseInt(events.rows[0].count),
      totalRsvps: parseInt(rsvps.rows[0].count),
      totalComments: parseInt(comments.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL USERS
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE USER
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM comments WHERE user_id=$1', [req.params.id]);
    await pool.query('DELETE FROM rsvps WHERE user_id=$1', [req.params.id]);
    await pool.query('DELETE FROM rsvps WHERE event_id IN (SELECT id FROM events WHERE organizer_id=$1)', [req.params.id]);
    await pool.query('DELETE FROM comments WHERE event_id IN (SELECT id FROM events WHERE organizer_id=$1)', [req.params.id]);
    await pool.query('DELETE FROM events WHERE organizer_id=$1', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL EVENTS
router.get('/events', auth, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name 
       FROM events e 
       JOIN users u ON e.organizer_id = u.id 
       ORDER BY e.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ANY EVENT
router.delete('/events/:id', auth, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM comments WHERE event_id=$1', [req.params.id]);
    await pool.query('DELETE FROM rsvps WHERE event_id=$1', [req.params.id]);
    await pool.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHANGE USER ROLE
router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    await pool.query('UPDATE users SET role=$1 WHERE id=$2', [role, req.params.id]);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;