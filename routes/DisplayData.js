const express = require('express');
const router = express.Router();

const User = require('../models/user'); // Import the User model
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



router.patch('/userdata', async (req, res) => {
    try {
        const { email, ...updatedData } = req.body;

    
        if (!email) {
            return res.status(400).json({ message: 'Email is required for updating user profile' });
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
