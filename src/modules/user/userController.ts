import { Request, Response } from "express";
import { UserService } from "./userService";
import { IUser } from "./userInterface";

export const createUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const data: IUser = req.body;
    const tenantId = (req as any).tenant

    if (!tenantId) {
      return res.status(400).json({ message: "No tenantId found" });
    }

    const user = await UserService.createUser(data, tenantId);

    return res.status(201).json({
      message: "User Created Successfully",
      data: user,
    });

  } catch (error: unknown) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
;
