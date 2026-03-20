import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthService } from "./authService";
import { cookieOptions } from "../../config/cookieConfig";
import { RegisterTenantDto } from "./authDto";
import { ApiResponse } from "../../utils/apiResponse";

export const registerTenantController1 = asyncHandler(
  async (req: Request, res: Response) => {
    const payload: RegisterTenantDto = req.body;

    const result = await AuthService.register(payload);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.status(201).json(
      new ApiResponse("Tenant created successfully", {
        tenantId: result.tenantId,
        accessToken: result.accessToken,
      }),
    );
  },
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    // Collect the oldToken
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) {
      throw new ApiError(403, "No token found");
    }

    const result = await AuthService.rotateRefreshToken(oldToken);
    res
      .cookie("refreshToken", result.refreshToken, cookieOptions)
      .status(200)
      .json({
        accessToken: result.newAccessToken,
      });
  },
);
