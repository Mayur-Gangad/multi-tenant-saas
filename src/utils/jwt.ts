import jwt from "jsonwebtoken";
import { AccessTokenDto, RefreshTokenDto } from "../modules/user/userDTO";
import { jwtConfig } from "../config/jwtConfig";
import { Types } from "mongoose";

export class JWT {
  static generateAccessToken = (payload: AccessTokenDto): string => {
    return jwt.sign(
      {
        userId: payload.userId,
        tenantId: payload.tenantId,
        role: payload.role,
      },
      jwtConfig.accessSecret,
      {
        expiresIn: "1d",
      },
    );
  };

  static verifyAccessToken = (
    token: string,
  ): AccessTokenDto & { iat?: number; exp?: number } => {
    return jwt.verify(token, jwtConfig.accessSecret) as AccessTokenDto & {
      iat: number;
      exp: number;
    };
  };

  static generateRefreshToken = (
    payload: RefreshTokenDto,
  ): { token: string; jti: string } => {
    const tokenId = new Types.ObjectId();
    const token = jwt.sign(
      {
        userId: payload.userId,
        tenantId: payload.tenantId,
        jti: tokenId.toString(),
        role: payload.role,
      },
      jwtConfig.refreshSecret,
      {
        expiresIn: "7d",
      },
    );
    return {
      token,
      jti: tokenId.toString(),
    };
  };

  static verifyRefreshToken = (
    token: string,
  ): RefreshTokenDto & {
    role: string;
    iat?: number;
    exp?: number;
    jti: string;
  } => {
    return jwt.verify(token, jwtConfig.refreshSecret) as RefreshTokenDto & {
      role: string;
      iat: number;
      exp: number;
      jti: string;
    };
  };
}
