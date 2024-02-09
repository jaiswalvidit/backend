const mongoose = require('mongoose');
const { Schema } = mongoose;


const restaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      unique: true,
      
    },
    cloudinaryImageId: {
      type: String,
    },
    areaName: {
      type: String,
      required: true
    },
    lists:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Item",
        },
    ],
    
    cuisines: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item",
    },
    ],

    Rating: {
      type: Number,
      required: true
    },
    
    DeliveryTime: {
      type: Number,
      required: true
    },
    availability: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

 
module.exports = mongoose.model('Restaurant', restaurantSchema);
