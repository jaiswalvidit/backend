const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET;

// Validation middleware for user creation
const validateUserCreation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

router.post('/createuser', validateUserCreation, async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const exist=await User.findOne({email:req.body.email});
    if(exist)
    {
      return res.status(404).json({message:'Email already eixsts'});
    }
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
      
    const newUser = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      location: req.body.geolocation,
      phone: req.body.phone,
    });

    console.log('User created successfully:', req.body.email);
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// User login route (no authentication required)
router.post('/loginuser', async (req, res) => {
  console.log(req.body);
  console.log(jwtSecret);

  try {
    
    const userData = await User.findOne({ email: req.body.email });
    console.log(userData);
    if (!userData) {
      console.log('User not found for email:', req.body.email);
      return res.status(400).json({ errors: 'Try logging in with correct credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, userData.password);

    if (!isPasswordCorrect) {
      console.log('Incorrect password for user:', req.body.email);
      return res.status(400).json({ errors: 'Try logging in with correct password' });
    }
    const payload = {
      user: {
        _id: userData._id,
      },
    };
    const authToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    console.log('User logged in:', req.body.name);
    res.json({ success: true, authToken: authToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});
module.exports = router;
