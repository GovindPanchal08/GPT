const mongoose = require("mongoose");

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
    return db.connection;
  } catch (error) {
    console.log("Error connecting to database:", error);
    
  }
}
module.exports = connectDB;

