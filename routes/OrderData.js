const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.get('/myOrderData', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const orders = await Order.find({ email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for the provided email' });
    }

    res.json({ orderData: orders });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/myOrderData/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const users = await Order.find({ email });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found for the provided email' });
    }

    res.json({ userData: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/myOrderData', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const orders = await Order.find({ email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for the provided email' });
    }

    res.json({ orderData: orders });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/myOrderData/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const users = await Order.find({ email });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found for the provided email' });
    }

    res.json({ userData: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/myOrderData/:email/:OrderDate', async (req, res) => {
  try {
    const { email, OrderDate } = req.params;

    // Validate email and OrderDate
    if (!email || typeof email !== 'string' || !OrderDate) {
      return res.status(400).json({ error: 'Invalid email address or order date' });
    }

    // Find the order
    const order = await Order.findOne({ email });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // console.log(order.products);
    // Filter out the product with matching Order_date
    const filteredProducts = order.products.filter(productGroup => {
      // console.log(productGroup[0]);
      const dateObject = productGroup[0];
      // console.log((new Date(OrderDate.toString())).toString(), "\n", dateObject.Order_date.toString());
      // console.log(dateObject.Order_date.toString()!==(new Date(OrderDate.toString())).toString());
      //console.log(typeof dateObject.Order_date));
      return dateObject.Order_date.toString()!==(new Date(OrderDate.toString())).toString();
    });

    // Update the order in the database
    await Order.findOneAndUpdate({ email }, { products: filteredProducts });

    // Send the updated order data as a response
    res.json(filteredProducts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/myOrderData/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const users = await Order.deleteOne({ email });

    if (!users || users.deletedCount === 0) {
      return res.status(404).json({ error: 'No users found for the provided email' });
    }

    res.status(200).json({ message: 'User data deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

router.delete('/myOrderData/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const users = await Order.deleteOne({ email });

    if (!users || users.deletedCount === 0) {
      return res.status(404).json({ error: 'No users found for the provided email' });
    }

    res.status(200).json({ message: 'User data deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
