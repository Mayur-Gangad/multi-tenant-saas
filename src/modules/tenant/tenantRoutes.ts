import { Router } from "express";
import {
  createTenantController,

} from "./tenantController";
const router = Router();

router.post("/", createTenantController);
// router.get("/", getAllTenantController);

export default router;
