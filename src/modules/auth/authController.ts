import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { LoginPayloadDto } from "../user/userDTO";
import { AuthService } from "./authService";
import { cookieOptions } from "../../config/cookieConfig";

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const loginPayload: LoginPayloadDto = req.body;
    const tenantId = req.tenant!._id.toString();
    const { accessToken, refreshToken } = await AuthService.login(
      loginPayload.email,
      loginPayload.password,
      tenantId,
    );
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json(
      new ApiResponse("Login Successfull", {
        accessToken: accessToken,
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
      .cookie("refreshToken", result.newRefreshToken, cookieOptions)
      .status(200)
      .json({
        accessToken: result.newAccessToken,
      });
  },
);
