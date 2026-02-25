import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`DB connected successfully`);
  } catch (error) {
    console.log(`Failed to connect the DB`);
    process.exit(1);
  }
};
