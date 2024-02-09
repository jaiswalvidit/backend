const express = require('express');
const router = express.Router();
const Otp = require('../models/otp');
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails
const User = require('../models/user');

router.post("/sendotp", async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.status(400).json({ error: "Please Enter Your Email" });
        }

        // Check if the user with the provided email exists in the database
        const preuser = await User.findOne({ email });

        if (preuser) {
            // Generate OTP
            const otp = Math.floor(100000+ Math.random() * 900000);

            // Save OTP to the database
            await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true });

            // Send OTP to user's email
            const transporter = nodemailer.createTransport({
                // Configure nodemailer with your email service provider
                service: 'gmail',
                auth: {
                    user: 'your_email@gmail.com', // Your email address
                    pass: 'your_password' // Your email password or app password
                }
            });

            const mailOptions = {
                from: 'your_email@gmail.com', // Sender email address
                to: email, // Recipient email address
                subject: 'Your OTP for Verification', // Email subject
                text: `Your OTP is ${otp}.` // Email body with OTP
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending email' });
                }
                console.log('Email sent:', info.response);
                res.json({ message: 'OTP sent successfully' });
            });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;
    
    if (!otp || !email) {
        return res.status(400).json({ error: "Please provide your OTP and Email" });
    }

    try {
        const otpVerification = await Otp.findOne({ email });
        if (otpVerification && otpVerification.otp == otp) {
            // OTP is verified successfully
            res.json({ message: "OTP verified successfully" });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
