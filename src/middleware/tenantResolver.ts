import { Request, Response, NextFunction } from "express";
import { TenantDao } from "../modules/tenant/tenantDao";

export const tenatRsolver = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    
    const host = req.headers.host;
    if (!host) {
      return res.status(400).json({ message: "Host header is missing" });
    }

    const subDomain = host.split(".")[0];

    console.log(`subDomain` , subDomain)
    const tenant = await TenantDao.findByDomain("acme");
    if (!tenant) {
      return res.status(400).json({ message: "tenant not found" });
    }

    (req as any).tenant = tenant;


    next();
  } catch (error) {
    return res.status(500).json({ message: "Tenant resolution failed" });
  }
};
