import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/healthRoutes";
import userRoutes from "./modules/user/userRoutes";
import tenantRoute from "./modules/tenant/tenantRoutes";
import { tenantResolver } from "./middleware/tenantResolver";
import { errorHandler } from "./middleware/globalError";
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/health", healthRoutes);

app.use("/user", tenantResolver, userRoutes);

app.use("/tenant", tenantRoute);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.use(errorHandler);

export default app;
