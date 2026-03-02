import { Router } from "express";
import {
  createUserController,
  getAllUserController,
  userLoginController,
} from "./userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { authoriseMiddleware } from "../../middleware/authoriseMiddleware";
const router = Router();

router.post("/login", userLoginController);

router.post("/admin",authMiddleware,authoriseMiddleware("admin"), createUserController);

router.get("/admin",authMiddleware,authoriseMiddleware("admin"), getAllUserController);


export default router;
