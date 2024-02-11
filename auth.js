const jwt = require('jsonwebtoken');
const User = require('./models/user');

const auth = async (req, res, next) => {
  try {
   
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    if (!token) {
      throw new Error('Authentication failed');
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      throw new Error('Conversion is not able to process');
    }

    // Find the user by the decoded token's ID
    const user = await User.findOne({'tokens.token': token });

    if (!user) {
      throw new Error('User not able to find');
    }

    // Attach the user object and token to the request
    req.user = user;
    console.log(req.user);
    console.log(user.token);
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;
