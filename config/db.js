// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`); // THIS IS THE LINE THAT SHOULD PRINT
  } catch (error) {
    // CATCH THE ERROR OBJECT
    console.error(`Error in connecting MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
