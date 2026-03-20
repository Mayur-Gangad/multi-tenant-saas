import { Router } from "express";
import {
  createUserController,
  getAllUserController,
  getUserByIdController,
  updatePasswordController,
  updateUserController,
  userLoginController,
} from "./userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { authoriseMiddleware } from "../../middleware/authoriseMiddleware";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver";
const router = Router();

router.post("/login", tenantResolverMiddleware, userLoginController); //login user

//list of all users
router.get(
  "/",
  authMiddleware,
  authoriseMiddleware("admin", "manager", "owner"),
  getAllUserController,
);

// get user by userId
router.get(
  "/id/:userId",
  authMiddleware,
  authoriseMiddleware("owner", "manager", "admin"),
  getUserByIdController,
);

// Update user
router.patch(
  "/:userId",
  authMiddleware,
  authoriseMiddleware("owner", "admin", "user"),
  updateUserController,
);

// Update password
router.patch(
  "/password/:userId",
  authMiddleware,
  authoriseMiddleware("owner", "admin", "user"),
  updatePasswordController,
);

//Create a user
router.post(
  "/",
  authMiddleware,
  authoriseMiddleware("admin", "owner", "manger"),
  createUserController,
);
export default router;
