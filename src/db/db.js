const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/GPT");
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
}
module.exports = connectDB;
