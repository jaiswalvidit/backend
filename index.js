require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')(process.env.stripe);
const MongoDb = require('./db');
const Order = require('./models/Orders');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from India');
});

MongoDb();

app.use('/api/auth', require('./routes/CreateData'));
app.use('/api', require('./routes/DisplayData'));
app.use('/api/auth/', require('./routes/Restaurant'));
app.use('/api/auth/', require('./routes/ItemData'));
app.use('/api', require('./routes/OrderData'));
app.use('/api',require('./routes/Review'));
app.use('/api',require('./routes/otpData'));
const port = process.env.PORT || 6000;

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    let { products, email } = req.body;

    // Convert products to an array if it's an object
    if (typeof products === 'object' && !Array.isArray(products)) {
      products = [products];
    }
    // Check if products is an array and is not empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty products array' });
    }

    console.log(products);

    let eId = await Order.findOne({ 'email': email });
    console.log("f");

    const paymentMethods = ['card'];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods,
      line_items: products.map((product) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.Name,
            images: [`${process.env.YOUR_DYNAMIC_BASE_URL}/${product.imageId}`],
            description: product.description,
          },
          unit_amount: product.price * 100, // Stripe requires amount in cents
        },
        quantity: product.qty,
      })),
      mode: 'payment',
      success_url: 'https://frontend-umber-one.vercel.app/success',
      cancel_url: 'https://frontend-umber-one.vercel.app/cancel',
      metadata: { orderId: eId ? eId._id.toString() : '' },
    });

    await products.splice(0, 0, { Order_date: new Date() });

    if (!eId) {
      try {
        await Order.create({
          email: email,
          products: [products], // Store the product details in the database
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server Error', error: error.message });
      }
    } else {
      try {
        await Order.findOneAndUpdate(
          { email: email },
          { $push: { products: products } } // Push the products into the existing order
        );
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server Error', error: error.message });
      }
    }

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
