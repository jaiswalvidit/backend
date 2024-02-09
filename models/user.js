const mongoose = require('mongoose');
const { Schema } = mongoose; 
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique:true
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
  }
},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);
