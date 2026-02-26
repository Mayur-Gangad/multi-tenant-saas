import { Request, Response } from "express";
import { TenantService } from "./tenantService";
import { ApiResponse } from "../../utils/apiResponse";
import { TenantResponseDto } from "./tenantDTO";

export const createTenantController = async (req: Request, res: Response) => {
  const data = req.body;

  const result: TenantResponseDto = await TenantService.createTenant(data);

  return res.status(201).json(new ApiResponse("Tenant created", result));
};

export const getAllTenantsController = async (req: Request, res: Response) => {
  const result: TenantResponseDto[] = await TenantService.getAllTenants();
  return res.status(200).json(new ApiResponse("Fetched Successfullly", result));
};
