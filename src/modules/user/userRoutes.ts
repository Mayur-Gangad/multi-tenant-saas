import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUserController,
  getUserByIdController,
  logoutController,
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
  authoriseMiddleware("admin", "owner", "manager"),
  createUserController,
);

// Delete User
router.delete(
  "/:userId",
  authMiddleware,
  authoriseMiddleware("admin", "owner", "manager"),
  deleteUserController,
);

// logiut user
router.post("/logout", authMiddleware, logoutController);
export default router;
