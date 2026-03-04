export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  expiresIn: (process.env.JWT_EXPIRES_IN as string) || "1d",
};
