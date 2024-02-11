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
router.patch('/auth/userdata', auth, async (req, res) => {
    console.log(req.body);
    const { password } = req.body;
    const user = req.user; 
    console.log(password);
    console.log(user);
    console.log(user.password);

    try {
        // Set the new password for the user
        user.password = password;
        // Save the updated user object with the new password
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
