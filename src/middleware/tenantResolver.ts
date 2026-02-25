import { Request, Response, NextFunction } from "express";
import { TenantDao } from "../modules/tenant/tenantDao";
import { ApiError } from "../utils/apiError";

export const tenantRsolver = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const subDomain = req.headers["x-tenant-id"] as string;

  if (!subDomain) {
    throw new ApiError(400, "Tenant header missing");
  }
  const tenant = await TenantDao.findByDomain(subDomain);

  if (!tenant) {
    throw new ApiError(400, "Tenant not found");
  }
  (req as any).tenant = tenant;
  next();
};
