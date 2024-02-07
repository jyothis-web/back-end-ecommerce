const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        // trim:true,
        unique:true, 
    },
    password:{
        type:String,
        required:true,
        // trim:true,
    },
    role: {
        type: Number,
        default: 0, // Default value for role, change as needed
      },
      updated_time: {
        type: Date,
        default: Date.now,
      },
      created_time: {
        type: Date,
        default: Date.now,
      },
})
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;