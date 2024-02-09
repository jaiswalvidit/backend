const express = require('express');
const router = express.Router();
const Review = require('../models/Customer'); // Assuming your model is named Review

router.post('/review', async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/review', async (req, res) => {
  try {
    const reviews = await Review.find();
    console.log(reviews);
    res.json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/review/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const review = await Review.find({ email }); // Assuming you want to find by email
    console.log(review);
    res.json(review);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
