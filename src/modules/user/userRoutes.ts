import { Router } from "express";
import { createUserController, getUserController } from "./userController";

const router = Router();

router.post("/", createUserController);

router.get("/", getUserController);

export default router;
