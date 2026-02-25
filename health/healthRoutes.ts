import { Router } from "express";
import { getHealth } from "../src/modules/health/healthController";


const router = Router();

router.get("/", getHealth);

export default router;
