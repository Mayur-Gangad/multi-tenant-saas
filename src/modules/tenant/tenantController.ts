import { Request, Response } from "express";
import { TenantService } from "./tenantService";
import { ITenant } from "./tenantInterface";
import { ApiResponse } from "../../utils/apiResponse";
export const createTenantController = async (req: Request, res: Response) => {
  const data = req.body;

  const result: ITenant = await TenantService.createTenant(data);

  return res.status(201).json(new ApiResponse("Tenant created", result));
};
