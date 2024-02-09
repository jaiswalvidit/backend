const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Restaurant = require('../models/restaurant'); 

router.post('/createItem', async (req, res) => {
  try {
    const {
      itemName,
      cloudinaryImageId,
      category,
      parentName,
      Rating,
      cost,
      availability,
      description
    } = req.body;

    if (!itemName || !category || !parentName || Rating === undefined || availability === undefined) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const createdItem = await Item.create({
      itemName,
      cloudinaryImageId,
      category,
      parentName,
      Rating,
      cost,
      availability,
      description
    });
    const restaurant = await Restaurant.findOne({ restaurantName: parentName });
    console.log("hi");
    console.log(restaurant);


    if (!restaurant) {
      return res.status(404).json({ message: 'First add Restaurant !!!!!!!!' });
    } 
    restaurant.lists.push(createdItem._id);
    console.log(createdItem._id);
    console.log(createdItem.category);
    await restaurant.save();
    
    res.status(201).json({ message: 'Item added successfully', item: createdItem });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicate key error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

router.get('/createItem', async (req, res) => {
  try {
    const items = await Item.find();

    items.forEach((item) => {
      console.log(item);
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
