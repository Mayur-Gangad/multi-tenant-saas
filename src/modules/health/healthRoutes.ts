import { Router } from "express";
import { getHealth } from "./healthController";

const router = Router();

router.get("/", getHealth);

export default router;
