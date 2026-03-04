import crypto from "crypto";
/**
 * 
 * @param refreshToken raw refresh token
 * @returns hashed refresh token
 */
export const hashedRefreshToken = (refreshToken: string): string => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};
