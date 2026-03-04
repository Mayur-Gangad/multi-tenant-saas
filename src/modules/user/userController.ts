import { Request, Response } from "express";
import { CreateUserDto, UserResponseDto } from "./userDTO";
import { UserService } from "./userService";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: CreateUserDto = req.body;
    if (!req.tenant) {
      throw new ApiError(401, "Tenant not found");
    }
    const tenantId: string = req.tenant._id.toString();
    const createdUser: UserResponseDto = await UserService.createUser({
      ...user,
      tenantId,
    });
    return res
      .status(201)
      .json(new ApiResponse("User Created Successfully", createdUser));
  },
);

export const getAllUserController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.tenant) {
      throw new ApiError(401, "Tenant not found");
    }
    const tenantId = req.tenant._id.toString();
    const result = await UserService.getAllUsersByTenant(tenantId);
    res.status(200).json(new ApiResponse("Fetched Users successfully", result));
  },
);
