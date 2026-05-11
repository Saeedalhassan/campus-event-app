const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { category, search, location, date_from, date_to } = req.query;
  let query = 'SELECT e.*, u.name as organizer_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND e.category = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
  }
  if (location) {
    params.push(`%${location}%`);
    query += ` AND e.location ILIKE $${params.length}`;
  }
  if (date_from) {
    params.push(date_from);
    query += ` AND e.start_time >= $${params.length}`;
  }
  if (date_to) {
    params.push(date_to);
    query += ` AND e.start_time <= $${params.length}`;
  }

  query += ' ORDER BY e.start_time ASC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, location, start_time, end_time, category, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, location, start_time, end_time, category, image_url, organizer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, description, location, start_time, end_time, category, image_url, req.user.id]
    );

    const event = result.rows[0];

    const organizer = await pool.query(
      'SELECT name FROM users WHERE id=$1',
      [req.user.id]
    );

    const followers = await pool.query(
      'SELECT follower_id FROM follows WHERE following_id=$1',
      [req.user.id]
    );

    for (const follower of followers.rows) {
      await require('../config/notifier').createNotification(
        follower.follower_id,
        `🎉 ${organizer.rows[0].name} created a new event: "${title}"`,
        `/events/${event.id}`
      );
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, u.name as organizer_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE e.id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Event not found' });

    const userId = req.headers.authorization ? 
      require('jsonwebtoken').verify(
        req.headers.authorization.split(' ')[1], 
        process.env.JWT_SECRET
      ).id : null;

    await pool.query(
      'INSERT INTO event_views (event_id, user_id) VALUES ($1, $2)',
      [req.params.id, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, location, start_time, end_time, category, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, location, start_time, end_time, category, image_url, organizer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, description, location, start_time, end_time, category, image_url, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, location, start_time, end_time, category, image_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE events SET title=$1, description=$2, location=$3, start_time=$4, end_time=$5, category=$6, image_url=$7 WHERE id=$8 AND organizer_id=$9 RETURNING *',
      [title, description, location, start_time, end_time, category, image_url, req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(403).json({ message: 'Not authorized or event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting event:', req.params.id);
    
    // First delete all RSVPs for this event
    await pool.query('DELETE FROM rsvps WHERE event_id=$1', [req.params.id]);
    
    // Then delete the event
    await pool.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;