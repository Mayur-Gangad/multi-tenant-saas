import { Router } from "express";
import {
  getAllTenantsController,
  getTenantBySubDomainController,
} from "./tenantController";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver";
const router = Router();

router.get(
  "/current",
  tenantResolverMiddleware,
  getTenantBySubDomainController,
);

router.get("/", getAllTenantsController);

export default router;
