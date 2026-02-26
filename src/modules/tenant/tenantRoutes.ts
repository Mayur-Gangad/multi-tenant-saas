import { Router } from "express";
import { createTenantController ,getAllTenantsController} from "./tenantController";
const router = Router();

router.post("/", createTenantController);

router.get("/",getAllTenantsController);

export default router;
