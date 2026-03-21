import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { JWT } from "../utils/jwt";
import { UserService } from "../modules/user/userService";
import { IUser } from "../modules/user/userInterface";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Step 1: Extract authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid token");
    }

    // Step 2: Extract token
    const token = authHeader.split(" ")[1];

    // Step 3: Verify & decode token
    const decoded = JWT.verifyAccessToken(token);

    // Step 4: Validate tenant
    if (decoded.tenantId !== req.tenant?._id.toString()) {
      throw new ApiError(403, "Mismatched tenant");
    }

    // Step 5: Fetch user from DB
    const user: IUser | null = await UserService.findUserById(
      decoded.userId,
      decoded.tenantId,
    );

    if (user?.isDeleted) {
      throw new ApiError(404, "User is deleted");
    }

    if (!user?._id) {
      throw new ApiError(401, "User not found");
    }

    // Step 6: Validate password change (invalidate old tokens)
    if (user.passwordChangedAt) {
      const passwordChangedTime = Math.floor(
        new Date(user.passwordChangedAt).getTime() / 1000,
      );

      if (!decoded.iat) {
        throw new ApiError(403, "Invalid token payload");
      }
      if (decoded.iat < passwordChangedTime) {
        throw new ApiError(401, "Token expired due to password change");
      }
    }

    // Step 7: Attach DB user (not token) to request
    req.user = {
      userId: user._id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    };

    // Step 8: Continue
    next();
  } catch (error) {
    next(error);
  }
};
