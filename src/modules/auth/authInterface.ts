import { Types } from "mongoose";
import { UserRole } from "../user/userDTO";

export interface BasePayload {
  userId: string;
  tenantId: string;
}
export interface AuthPayload extends BasePayload {
  role: string;
}

export interface RefreshTokenPayload extends BasePayload {
  jti: string;
}

export interface IRefreshToken {
  jti: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  revokedAt: Date | null;
  revokedBy: UserRole | null;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
