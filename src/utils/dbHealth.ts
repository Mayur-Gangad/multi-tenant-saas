import mongoose from "mongoose";

export const checkDbHealth = () => {
  return mongoose.connection.readyState === 1;
};
