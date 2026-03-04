import { Router } from "express";
import { createUserController, getAllUserController } from "./userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { authoriseMiddleware } from "../../middleware/authoriseMiddleware";
const router = Router();

router.get(
  "/",
  authMiddleware,
  authoriseMiddleware("admin"),
  getAllUserController,
);

router.post(
  "/",
  authMiddleware,
  authoriseMiddleware("admin"),
  createUserController,
);
export default router;
