import { Request, Response } from "express";
import { CreateUserDto, LoginPayloadDto, UserResponseDto } from "./userDTO";
import { UserService } from "./userService";
import { ApiResponse } from "../../utils/apiResponse";
import { AuthService } from "../auth/authService";

export const createUserController = async (req: Request, res: Response) => {
  const user: CreateUserDto = req.body;
  const tenantId: string = req.tenant!?._id.toString();
  const createdUser: UserResponseDto = await UserService.createUser({
    ...user,
    tenantId,
  });
  return res
    .status(201)
    .json(new ApiResponse("User Created Successfully", createdUser));
};

export const getAllUserController = async (req: Request, res: Response) => {
  const tenantId = req.tenant!._id.toString();
  const result = await UserService.getAllUsersByTenant(tenantId);
  res.status(200).json(new ApiResponse("Fetched Users successfully", result));
};

export const userLoginController = async (req: Request, res: Response) => {
  const loginPayload: LoginPayloadDto = req.body;
  const tenantId = req.tenant!._id.toString();
  const token: string = await AuthService.login(
    loginPayload.email,
    loginPayload.password,
    tenantId,
  );
  res.status(200).json(new ApiResponse("Login Successfull", token));
};
