import { ClientSession } from "mongoose";
import { RefreshTokenDto } from "../user/userDTO";
import { IRefreshToken } from "./authInterface";
import { RefreshToken } from "./refreshTokenModel";
import { ApiError } from "../../utils/apiError";

export class RefreshTokenDao {
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
    session: ClientSession,
  ): Promise<IRefreshToken | null> {
    return RefreshToken.findOne(
      {
        jti,
        tokenHash: oldTokenHash,
        revokedAt: null,
      },
      null,
      { session },
    );
  }

  static async rotateToken(
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
      { jti: oldJti, revokedAt: null },
      {
        $set: {
          revokedAt: new Date(),
          revokedBy: role,
        },
      },
      {
        session,
      },
    );

    if (!updatedToken) {
      throw new ApiError(401,"Token alredy revoked!!");
    }

    await RefreshToken.create(
      [
        {
          jti: newJti,
          userId,
          tenantId,
          tokenHash: newTokenHash,
          revokedAt: null,
          revokedBy: null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      {
        session,
      },
    );
  }
}
