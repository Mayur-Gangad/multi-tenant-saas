import { Router } from "express";
import { createTenantController } from "./tenantController";
const router = Router();

router.post("/", createTenantController);

export default router;
