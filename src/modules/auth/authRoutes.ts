import { Router } from "express";
import {
 
  refreshTokenController,
  registerTenantController1,
} from "../auth/authController";

const router = Router();

router.post("/register",registerTenantController1)
router.post("/refresh", refreshTokenController);

export default router;
