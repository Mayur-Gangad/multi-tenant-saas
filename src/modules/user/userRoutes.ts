import { Router } from "express";
import { createUserController, getAllUserController } from "./userController";

const router = Router();

router.post("/", createUserController);

router.get("/", getAllUserController);

export default router;
