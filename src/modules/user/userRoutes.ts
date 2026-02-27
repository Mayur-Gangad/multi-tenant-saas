import { Router } from "express";
import {
  createUserController,
  getAllUserController,
  userLoginController,
} from "./userController";
;

const router = Router();

router.post("/login", userLoginController);

router.post("/", createUserController);

router.get("/", getAllUserController);


export default router;
