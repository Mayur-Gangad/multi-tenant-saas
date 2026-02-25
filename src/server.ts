import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
      console.log(`The server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Failed to start the server`);
    process.exit(1);
  }
};

startServer();
