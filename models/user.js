const mongoose = require('mongoose');
const { Schema } = mongoose; 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Correct import


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true 
  },
  location: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    // required: true,
  } // Removed the extra comma here
}, { timestamps: true });

UserSchema.methods.generateAuthToken = async function() {
  try {
    const newToken = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Convert _id to string
    this.token = newToken; // Set the token directly to the instance
    await this.save(); // Save the updated user instance
    return newToken;
  } catch (error) {
    throw new Error("Error generating token");
  }
}

module.exports = mongoose.model('User', UserSchema);
