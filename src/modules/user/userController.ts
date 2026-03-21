import { Request, Response } from "express";
import {
  AdminUpdateDto,
  CreateUserDto,
  LoginPayloadDto,
  UpdatePasswordDto,
  UserResponseDto,
  UserUpdateDto,
} from "./userDTO";
import { UserService } from "./userService";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { IUser } from "./userInterface";
import { AuthService } from "../auth/authService";
import { parseUserRole } from "./userUtils";

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: LoginPayloadDto = req.body;

    if (!req.tenant) {
      throw new ApiError(401, "Tenant not found");
    }
    const tenantId: string = req.tenant._id.toString();

    const result = await AuthService.login(data.email, data.password, tenantId);

    res.cookie("refreshToken", result.refreshToken);

    res
      .status(200)
      .json(new ApiResponse("Login successfull", result.accessToken));
  },
);

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

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.userId) {
      throw new ApiError(401, "UserId is missing");
    }

    const userId: string = req.params.userId.toString();

    if (!req.tenant) {
      throw new ApiError(401, "Tenant not found");
    }
    const tenantId = req.tenant._id.toString();

    const user: IUser | null = await UserService.findUserById(userId, tenantId);

    if (!user) {
      throw new ApiError(404, "No user Found");
    }

    res.status(200).json(new ApiResponse("User Fetched Successfully", user));
  },
);

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    // Step 1: Check Authentication
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

     if (!req.params.userId) {
      throw new ApiError(400, "UserId is required");
    }

    // Step 2 : Extract required fileds
    const targetUserId = req.params.userId.toString();
    const loggedInUserId = req.user.userId.toString();
    const loggedInUserRole = parseUserRole(req.user.role);
    const tenantId = req.user.tenantId;

    // Step 3: Get payload
    const data: UserUpdateDto | AdminUpdateDto = req.body;

    // Step 4 : Call service layer
    const result = await UserService.updateUser(
      data,
      loggedInUserId,
      targetUserId,
      tenantId,
      loggedInUserRole,
    );

    // Step 5 : Send response
    res.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  },
);

export const updatePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const payload: UpdatePasswordDto = req.body;

    if (!req.user) {
      throw new ApiError(404, "NO user found");
    }

    const loggedInUserId = req.user.userId.toString();
    const tenantId = req.user.tenantId;

    await UserService.changePassword(payload, loggedInUserId, tenantId);

    res.status(204).json({
      message: "Password is updated successfully",
    });
  },
);

export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    
    if (!req.params.userId) {
      throw new ApiError(400, "UserId is missing");
    }

    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!req.tenant) {
      throw new ApiError(400, "Tenant not found");
    }

    const userId: string = req.params.userId.toString();

    const deletedBy: string = req.user?.userId;

    const tenantId = req.tenant._id.toString();

    const result = await UserService.deleteUser(userId, tenantId, deletedBy);

    res.status(200).json({
      message: "User deleted successfully",
      data: result,
    });
  },
);
