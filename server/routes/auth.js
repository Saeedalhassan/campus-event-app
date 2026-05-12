const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../config/mailer');

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows[0]) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, verification_token, is_verified) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, role',
      [name, email, hash, role || 'student', verificationToken, true]
    );
    const user = result.rows[0];

    try {
      await sendVerificationEmail(email, name, verificationToken);
      await sendWelcomeEmail(email, name);
    } catch (emailErr) {
      console.error('Email failed:', emailErr);
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// VERIFY EMAIL
router.get('/verify/:token', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_verified=true, verification_token=null WHERE verification_token=$1 RETURNING id, name, email, role',
      [req.params.token]
    );
    if (!result.rows[0]) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user, message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE users SET verification_token=$1 WHERE email=$2',
      [resetToken, email]
    );

    await sendPasswordResetEmail(email, user.name, resetToken);
    res.json({ message: 'Password reset email sent! Check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE verification_token=$1',
      [req.params.token]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password_hash=$1, verification_token=null WHERE id=$2',
      [hash, user.id]
    );

    res.json({ message: 'Password reset successful! You can now login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET CURRENT USER
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, avatar_url, is_verified FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;