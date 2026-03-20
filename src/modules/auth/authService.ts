import bcrypt from "bcrypt";
import { ApiError } from "../../utils/apiError";
import { JWT } from "../../utils/jwt";
import { hashedRefreshToken } from "../../utils/tokenHash";
import { RefreshTokenDao } from "./refreshTokenDao";
import mongoose, { ClientSession } from "mongoose";
import { RegisterResponseDto, RegisterTenantDto } from "./authDto";
import { TenantService } from "../tenant/tenantService";
import { UserService } from "../user/userService";
import { UserDao } from "../user/userDao";
import { RefreshTokenDto } from "../user/userDTO";
import { IUser } from "../user/userInterface";

export class AuthService {
  static async register(data: RegisterTenantDto): Promise<RegisterResponseDto> {
    // 1. check if subdomain already exists
    const existingTenant = await TenantService.findTenantBySubDomain(
      data.tenant.subDomain,
    );
    if (existingTenant) {
      throw new ApiError(409, "Tenant already exists");
    }

    // 2. create tenant
    const tenant = await TenantService.createTenant(data.tenant);

    // 3. create owner user
    const user = await UserService.createUser({
      ...data.adminUser,
      tenantId: tenant.id.toString(),
      role: "owner",
      tenant: tenant.subDomain,
    });
    // /4. generate access token
    const accessToken = JWT.generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });
    // 5. generate refresh token
    const { refreshToken, jti } = JWT.generateRefreshToken({
      userId: user.id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    });
    // 7. hash refresh token
    const refreshTokenHash = hashedRefreshToken(refreshToken);
    // 8. store refresh token
    await RefreshTokenDao.insertRefreshToken(jti, refreshTokenHash, {
      userId: user.id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    });
    // 9. return tokens

    return { tenantId: tenant.id, accessToken, refreshToken };
  }

  static async login(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user: IUser | null = await UserDao.getUserByEmail(email, tenantId);

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

    const { refreshToken, jti } = JWT.generateRefreshToken({
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
      const { refreshToken, jti } = JWT.generateRefreshToken({
        userId: currentUserId,
        tenantId: currentTenantId,
        role: role,
      });

      const newTokenHash = hashedRefreshToken(refreshToken);

      await RefreshTokenDao.rotateToken(
        oldJti,
        currentUserId,
        currentTenantId,
        newTokenHash,
        jti,
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
      return { newAccessToken, refreshToken };
    } catch (err: any) {
      await session.abortTransaction();
      throw err;
    } finally {
      // end the transaction
      session.endSession();
    }
  }
}
