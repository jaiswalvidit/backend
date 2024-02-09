const mongoose = require('mongoose');
const { Schema } = mongoose;
const Validator = require('validator');

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => Validator.isEmail(value),
                message: 'Not valid Email'
            }
        },
        otp: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Otp', otpSchema);
