import { Request, Response, NextFunction } from "express";
import { TenantDao } from "../modules/tenant/tenantDao";
import { ApiError } from "../utils/apiError";

export const tenantResolver = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const subDomain = req.headers["x-tenant-subdomain"] as string;

  if (!subDomain) {
    throw new ApiError(404, "Tenant header missing");
  }
  const tenant = await TenantDao.findBySubDomain(subDomain);

  
  if (!tenant) {
    throw new ApiError(400, "Tenant not found");
  }
  req.tenant = tenant;
  next();
};
