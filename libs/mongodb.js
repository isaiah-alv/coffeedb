import mongoose from "mongoose";

const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined.");
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  if (mongoose.connection.readyState === 0) {
    try {
      console.log('MONGODB_URI:', process.env.MONGODB_URI);
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
};

export default connectMongoDB;
