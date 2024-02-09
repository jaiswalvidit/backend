// auth.js

const jwt = require('jsonwebtoken');
const jwtSecret = 'your_secret_key'; // Replace with your actual secret key

const auth = (req, res, next) => {
  // Get token from request header
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. Token not found.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Add user from payload to request object
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
