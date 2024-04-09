require("dotenv").config();
const mongoose = require('mongoose');
const mongoURL =process.env.mongoURL; 
// const usersCollectionName = 'users';

const MongoDb = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options if needed
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process with a non-zero status code indicating failure
  }
};
module.exports = MongoDb;
