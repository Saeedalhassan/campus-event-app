const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { createNotification } = require('../config/notifier');

// GET COMMENTS FOR EVENT
router.get('/:eventId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name, u.avatar_url 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.event_id = $1 
       ORDER BY c.created_at ASC`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD COMMENT OR REPLY
router.post('/:eventId', auth, async (req, res) => {
  const { content, parent_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO comments (event_id, user_id, content, parent_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.eventId, req.user.id, content, parent_id || null]
    );
    const comment = result.rows[0];
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );
    comment.name = userResult.rows[0].name;

    const eventResult = await pool.query(
      'SELECT organizer_id, title FROM events WHERE id = $1',
      [req.params.eventId]
    );
    const event = eventResult.rows[0];

    if (parent_id) {
      const parentComment = await pool.query(
        'SELECT user_id FROM comments WHERE id = $1',
        [parent_id]
      );
      if (parentComment.rows[0] && parentComment.rows[0].user_id !== req.user.id) {
        await createNotification(
          parentComment.rows[0].user_id,
          `💬 ${comment.name} replied to your comment`,
          `/events/${req.params.eventId}`
        );
      }
    } else if (event && event.organizer_id !== req.user.id) {
      await createNotification(
        event.organizer_id,
        `💬 ${comment.name} commented on your event "${event.title}"`,
        `/events/${req.params.eventId}`
      );
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE COMMENT
router.delete('/:commentId', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM comments WHERE id=$1 AND user_id=$2',
      [req.params.commentId, req.user.id]
    );
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;