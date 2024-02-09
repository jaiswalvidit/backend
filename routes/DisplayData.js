const express = require('express');
const router = express.Router();
const auth = require('../auth'); // Import the auth middleware
const User = require('../models/user');

// const User = require('../models/user'); // Import the User model
router.get('/userdata/:email', async (req, res) => {
    try {
        const email = req.params.email; // Access email from params directly
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


router.patch('/userdata', auth, async (req, res) => {
    try {
        const { email, password, ...updatedData } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required for updating user profile' });
        }

        // If password is provided, hash it before updating
        if (password) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Find and update the user in the MongoDB collection
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});

module.exports = router;
