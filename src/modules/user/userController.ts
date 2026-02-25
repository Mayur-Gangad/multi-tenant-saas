import { Request, Response } from "express";
import { UserService } from "./userService";
import { IUser } from "./userInterface";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";

export const createUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const data: IUser = req.body;
  const tenantId = (req as any).tenant;

  const user = await UserService.createUser(data, tenantId);

  res.status(201).json(new ApiResponse("User created Successfully", user));
};

export const getUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const tenantId = (req as any).tenant;

  const users = await UserService.getUser(tenantId);

  res.status(200).json(new ApiResponse("Users fethed Successfullt", users));
};
