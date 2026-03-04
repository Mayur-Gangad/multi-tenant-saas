import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthRoutes from "./modules/health/healthRoutes";
import authRauter from "./modules/auth/authRoutes";
import userRoutes from "./modules/user/userRoutes";
import tenantRoute from "./modules/tenant/tenantRoutes";
import { tenantResolver } from "./middleware/tenantResolver";
import { errorHandler } from "./middleware/globalError";
const app = express();

app.use(
  cors({   // Then allow cross-origin
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json()); //Parse body 1st

app.use(cookieParser()); // Parse cookie

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/auth", tenantResolver, authRauter);

app.use("/api/v1/user", tenantResolver, userRoutes);

app.use("/api/v1/tenant", tenantRoute);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.use(errorHandler);

export default app;
