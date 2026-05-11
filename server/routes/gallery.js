const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// GET IMAGES FOR EVENT
router.get('/:eventId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM event_images WHERE event_id = $1 ORDER BY created_at ASC',
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD IMAGE TO EVENT
router.post('/:eventId', auth, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO event_images (event_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [req.params.eventId, imageUrl, caption || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE IMAGE
router.delete('/:imageId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM event_images WHERE id = $1', [req.params.imageId]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;