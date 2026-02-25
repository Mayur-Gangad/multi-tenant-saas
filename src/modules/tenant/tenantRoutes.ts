import { Router } from "express";
import {
  createTenantController,
  getAllTenantController,
} from "./tenantController";
const router = Router();

router.post("/", createTenantController);
router.get("/", getAllTenantController);

export default router;
