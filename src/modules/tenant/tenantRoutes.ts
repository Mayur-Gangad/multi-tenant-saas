import { Router } from "express";
import { createTenantController ,getAllTenantsController, getTenantBySlugController} from "./tenantController";
import { tenantResolver } from "../../middleware/tenantResolver";
const router = Router();

router.post("/", createTenantController);

router.get("/current",tenantResolver,getTenantBySlugController)

router.get("/",getAllTenantsController);


export default router;
