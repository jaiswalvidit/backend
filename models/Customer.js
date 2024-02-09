const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'mandatory to input'],
    },
    email: {
      type: String,
      required: [true, 'mandatory to input'],
      unique: false,
    },
    Rating: {
      type: Number,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    customer_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    Message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
