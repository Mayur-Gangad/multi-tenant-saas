import { Request, Response, NextFunction } from "express";
import { TenantDao } from "../modules/tenant/tenantDao";
import { ApiError } from "../utils/apiError";

export const tenantResolverMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // step.1 > extract domain from header
  const subDomain = req.headers["x-tenant-subdomain"] as string;

  // step.2 > Chech wheather domain avialable or not
  if (!subDomain) {
    throw new ApiError(404, "Tenant header missing");
  }
  // step.3 > Find the tenant from sundomain
  const tenant = await TenantDao.findBySubDomain(subDomain);

  // step.4 > Check whather the tenant exist or not
  if (!tenant) {
    throw new ApiError(400, "Tenant not found");
  }
  // step.5 > Attach tenant to request for further downstreame
  req.tenant = tenant;

  // step.6 > pass control to next middleware/controller
  next();
};
