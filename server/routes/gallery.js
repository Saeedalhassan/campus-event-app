const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusevents/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage });

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

router.post('/:eventId', auth, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file.path;
    const result = await pool.query(
      'INSERT INTO event_images (event_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [req.params.eventId, imageUrl, caption || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:imageId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM event_images WHERE id = $1', [req.params.imageId]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;