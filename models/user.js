const mongoose = require('mongoose');
const { Schema } = mongoose; 
const bcrypt=require('bcryptjs');
const jwt=require('jwttoken');
const SECRET_KEY="AACC";
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
  },
  tokens:[
    {token:{
      type:String,
      required:true,
    }}
  ]
},{timestamps:true});

UserSchema.methods.generateAuthToken=async function()
{
  try {
    let newToken=jwt.sign({_id:this._id},SECRET_KEY,{expiresIn:"1d"});

  } catch (error) {
    res.status(400).json({error:"Invalid details"});
  }

  this.tokens=this.tokens.concat({token:newToken});
  await this.save();
  return newToken;
}

module.exports = mongoose.model('User',UserSchema);
