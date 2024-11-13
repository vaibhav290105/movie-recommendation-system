const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Received token:', token); // Log the received token for debugging

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    // Log specific error details
    console.error('Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token is not valid. Please log in again.' });
    } else {
      return res.status(401).json({ msg: 'Authorization error. Please log in again.' });
    }
  }
};

module.exports = authMiddleware;  





