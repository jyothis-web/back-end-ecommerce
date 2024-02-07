const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING,{
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`error in mongodb ${error}`);
  }
};
module.exports = connectDB;


