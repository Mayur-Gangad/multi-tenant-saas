import { Request, Response } from "express";
import { TenantService } from "./tenantService";
import { ITenant } from "./tenantInterface";
import { ApiResponse } from "../../utils/apiResponse";

export const createTenantController = async (req: Request, res: Response) => {
  const data = req.body;

  const result: ITenant = await TenantService.createTenant(data);

  return res.status(201).json(new ApiResponse("Tenant created", result));
};

export const getAllTenantController = async (req: Request, res: Response) => {
  
  const result: ITenant[] = await TenantService.getAllTenant();

  return res.status(200).json(new ApiResponse("Fetched successfully", result));
};
