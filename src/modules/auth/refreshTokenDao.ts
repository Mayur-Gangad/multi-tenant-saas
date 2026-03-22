import { ClientSession } from "mongoose";
import { RefreshTokenDto } from "../user/userDTO";
import { IRefreshToken } from "./authInterface";
import { RefreshToken } from "./refreshTokenModel";
import { ApiError } from "../../utils/apiError";

export class RefreshTokenDao {
  private static baseFilter(tenantId: string) {
    return { tenantId, isRevoked: false };
  }
  static async insertRefreshToken(
    jti: string,
    tokenHash: string,
    refreshToken: RefreshTokenDto,
  ): Promise<IRefreshToken | null> {
    return RefreshToken.findOneAndUpdate(
      { userId: refreshToken.userId, tenantId: refreshToken.tenantId },
      {
        $set: {
          jti,
          tokenHash,
          isRevoked: false,
          revokedAt: null,
          revokedBy: null,
          tenantId: refreshToken.tenantId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    ).lean();
  }

  static async findActiveToken(
    jti: string,
    oldTokenHash: string,
    tenantId:string,
    session: ClientSession,
  ): Promise<IRefreshToken | null> {
    return RefreshToken.findOne(
      {
        jti,
        tokenHash: oldTokenHash,
        ...this.baseFilter(tenantId),
      },
      null,
      { session },
    ).lean()
  }

  static async findTokenByJti(
    jti: string,
    userId: string,
    tenantId: string,
  ): Promise<IRefreshToken | null> {
    const token = await RefreshToken.findOne({
      jti,
      userId,
      ...this.baseFilter(tenantId),
    }).lean()

    if (!token) {
      return null
    }

    return token;
  }

  static async revokeToken(
    jti: string,
    userId: string,
    tenantId: string,
  ): Promise<void> {
    const updataedToken = await RefreshToken.findOneAndUpdate(
      {
        jti,
        userId,
        ...this.baseFilter(tenantId),
      },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
          revokedBy: userId,
        },
      },
      {
        returnDocument: "after",
      },
    ).lean()
    if (!updataedToken) {
     return 
    }
  }

  static async rotateRefreshToken(
    oldJti: string,
    userId: string,
    tenantId: string,
    newTokenHash: string,
    newJti: string,
    role: string,
    session: ClientSession,
  ) {
    // lets revoke the old token
    const updatedToken = await RefreshToken.findOneAndUpdate(
      { jti: oldJti, ...this.baseFilter(tenantId) },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
          revokedBy: role,
        },
      },
      {
        session,
      },
    );

    if (!updatedToken) {
     return null;
    }

    await RefreshToken.create(
      [
        {
          jti: newJti,
          userId,
          tenantId,
          isRevoked: false,
          tokenHash: newTokenHash,
          revokedAt: null,
          revokedBy: null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      {
        session,
      },
    )

    
  }
}
