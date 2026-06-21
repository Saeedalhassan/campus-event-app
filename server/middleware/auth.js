const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userExists = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (!userExists.rows[0]) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};