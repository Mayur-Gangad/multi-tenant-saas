import { model, Schema } from "mongoose";
import { IRefreshToken } from "./authInterface";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    jti: {
      type: String,
      unique: true,
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedBy: {
      type: String,
      default: null,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index({
  jti: 1,
  tokenHash: 1,
  revokedAt: 1,
});

refreshTokenSchema.index({
  userId: 1,
  revokedAt: 1,
});

refreshTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
