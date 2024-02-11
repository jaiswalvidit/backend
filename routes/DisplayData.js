const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../auth'); // Import the auth middleware
const User = require('../models/user');

// GET user data by email
router.post('/userdata', async (req, res) => {
    try {
        const { email } = req.body; // Access email from request body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// PATCH endpoint for updating password (authentication required)
router.patch('/auth/userdata', auth, async (req, res) => {
    try {
        const { password } = req.body;
        const user = req.user; // Assuming auth middleware sets req.user

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH endpoint for updating user data (email-based)
router.patch('/user', async (req, res) => {
    try {
        const { email, name, phone } = req.body; // Destructure email, name, and phone from req.body
        console.log(email, name, phone); // Corrected typo: "conseole" to "console"
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data based on newData object
        if (name) { // Changed condition to check if name is provided
            user.name = name; // Updated user's name
        }
        if (phone) { // Changed condition to check if phone is provided
            user.phone = phone; // Updated user's phone
        }

        await user.save();
        res.status(200).json({ message: 'User data updated successfully',user });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
