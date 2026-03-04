import { Router } from "express";
import {
  userLoginController,
  refreshTokenController,
} from "../auth/authController";
const router = Router();

router.post("/login", userLoginController);
router.post("/refresh", refreshTokenController);

export default router;
