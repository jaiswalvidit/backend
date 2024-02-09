require("dotenv").config();
const mongoose = require('mongoose');
const mongoURL =process.env.mongoURL; 
// const usersCollectionName = 'users';

const MongoDb = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to Mongodb');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};
module.exports = MongoDb;
