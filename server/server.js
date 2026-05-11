const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const rsvpRoutes = require('./routes/rsvps');
const uploadRoutes = require('./routes/upload');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const galleryRoutes = require('./routes/gallery');
const likesRoutes = require('./routes/likes');
const ratingsRoutes = require('./routes/ratings');
const announcementRoutes = require('./routes/announcements');
const analyticsRoutes = require('./routes/analytics');
const followsRoutes = require('./routes/follows');
const leaderboardRoutes = require('./routes/leaderboard');
const { startReminderJob } = require('./config/reminder');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => res.send('Campus Event API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderJob();
});