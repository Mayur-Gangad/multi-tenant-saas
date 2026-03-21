import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const authoriseMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user?.role!)) {
      throw new ApiError(403, "Forbidden:Access Denied");
    }
    next();
  };
};
