import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDb = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
};

export default connectDb;
