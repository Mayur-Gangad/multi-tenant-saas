import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { JWT } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // step.1> Extract autherization header
    const authHeader = req.headers.authorization;
    // step.2 > Validate the token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid Token");
    }

    // step.3 >Extract token from header
    const token = authHeader.split(" ")[1];

    // step.4 > Verify and decode the token (verify ===> decode )
    const decode = JWT.verifyAccessToken(token);

    // step.5 > Ensure that the tenant from token must be equal to the tenant from header
    //             this will protect cross tenant access
    if (decode.tenantId !== req.tenant?._id.toString()) {
      
      throw new ApiError(403, "Mismatched Tenant");
    }

    // step.6 > Attach decoded user to req for downstream use
    req.user = decode;

    // step.7 > pass control to next middleware (if any) or to controller
    next();
  } catch (error) {
    // stept.8 > Catch the error and pass to error handler middleware 
    next(error);
  }
};
