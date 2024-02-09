const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
router.post('/addRestaurant', async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/addRestaurant/:restaurantName', async (req, res) => {
  try {
    const { restaurantName} = req.params;
    const restaurantWithItems = await Restaurant.findById(restaurantName)
  .populate('lists');
    res.json(restaurantWithItems);
  } catch (error) {
    console.error('Error getting restaurant with items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/addRestaurant', async (req, res) => {
  try {
    const restaurantWithItems = await Restaurant.find().populate({
      path: 'cuisines',
      select: 'category',
    });
    console.log(restaurantWithItems);
    res.status(200).json(restaurantWithItems);
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
