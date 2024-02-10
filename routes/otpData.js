require("dotenv").config();
const express = require('express');
const router = express.Router();
const Otp = require('../models/otp');
const nodemailer = require('nodemailer'); 

const User = require('../models/user');

router.post("/sendotp", async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.status(400).json({ error: "Please Enter Your Email" });
        }

        // Check if the user with the provided email exists in the database
        const preuser = await User.findOne({email});

        if (preuser) {
            
            const otp = Math.floor(100000 + Math.random() * 900000);
            await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true });
            const transporter = nodemailer.createTransport({
                // Configure nodemailer with your email service provider
                service: 'gmail',
                auth: {
                    user:process.env.EMAIL,
                    pass: process.env.APP_PASSWORD,
                }
            });

            const mailOptions = {
                from: process.env.EMAIL, // Sender email address
                to: email, // Recipient email address
                subject: 'Send email using nodemailer and gmail', // Email subject
                text: `Your OTP is ${otp}.` // Email body with OTP
            };


            const sendMail=async(transporter,mailOptions)=>{
                try {
                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.log(error);
                }
            }
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
            res.json({ message: "OTP verified successfully" });
            const preuser=await User.findOne({email});
            console.log(preuser);

            const token= await preuser.generateAuthToken();
            console.log(token);
            res.status(200).json({message:"user login successfully",userToken:token});
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
