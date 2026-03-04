
import bcrypt from "bcrypt";
import { UserDao } from "../user/userDao";
import { ApiError } from "../../utils/apiError";
import { JWT } from "../../utils/jwt";
import { hashedRefreshToken } from "../../utils/tokenHash";
import { RefreshTokenDao } from "./refreshTokenDao";
import { RefreshTokenDto, UserResponseDto } from "../user/userDTO";
import mongoose, { ClientSession } from "mongoose";
import { UserService } from "../user/userService";

export class AuthService {
  static async login(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await UserDao.getUserByEmail(email, tenantId);

    if (!user || !user.password) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = JWT.generateAccessToken({
      userId: user._id!.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    });

    const { token: refreshToken, jti } = JWT.generateRefreshToken({
      userId: user._id!.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    });

    const refreshTokenHash = hashedRefreshToken(refreshToken);

    const refreshTokenPayload: RefreshTokenDto = {
      userId: user._id!.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    };

    await RefreshTokenDao.insertRefreshToken(
      jti,
      refreshTokenHash,
      refreshTokenPayload,
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  static async rotateRefreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new ApiError(403, "Refresh token missing");
    }
    // Get the old refrehToken
    let decode;
    try {
      decode = JWT.verifyRefreshToken(oldRefreshToken);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Extract the jti, userId and tenantId
    const oldJti = decode.jti;
    const currentUserId = decode.userId;
    const currentTenantId = decode.tenantId;
    const role = decode.role;

    // initialize the  mongoSession
    const session: ClientSession = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    const oldTokenHash = hashedRefreshToken(oldRefreshToken);

    // find the active token
    try {
      const activeToken = await RefreshTokenDao.findActiveToken(
        oldJti,
        oldTokenHash,
        session,
      );

      if (!activeToken) {
        throw new ApiError(401, "Refresh token already used or invalid");
      }

      // create new Refresh Token
      const { token: newRefreshToken, jti: newJti } = JWT.generateRefreshToken({
        userId: currentUserId,
        tenantId: currentTenantId,
        role: role,
      });

      const newTokenHash = hashedRefreshToken(newRefreshToken);

      await RefreshTokenDao.rotateToken(
        oldJti,
        currentUserId,
        currentTenantId,
        newTokenHash,
        newJti,
        role,
        session,
      );
      // commit the transaction
      await session.commitTransaction();
       // create new Access Token
      const newAccessToken = JWT.generateAccessToken({
        userId: currentUserId,
        tenantId: currentTenantId,
        role: role,
      });
      return { newAccessToken, newRefreshToken };
    } catch (err: any) {
      await session.abortTransaction();
      throw err;
    } finally {
      // end the transaction
      session.endSession();
    }
  }
}
