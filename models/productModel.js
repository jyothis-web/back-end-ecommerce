const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category:{
    type:mongoose.ObjectId,
    ref:'category'
  },
  image:{
    image:String,
    ContentType:String,
    imagePath:String,
  },
  rating: {
    type: Number, // Store the rating as a number
    default: 0,   // Default value if not provided
  },
  newimg: {
    type: Number, // Store the rating as a number
    default: 0,   // Default value if not provided
  },

},{timestamps:true});
const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
