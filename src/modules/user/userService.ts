import { ApiError } from "../../utils/apiError";
import { UserDao } from "./userDao";
import {
  AdminUpdateDto,
  CreateUserDto,
  UpdatePasswordDto,
  UserResponseDto,
  UserRole,
  UserUpdateDto,
} from "./userDTO";
import { IUser } from "./userInterface";
import { sanitizeUpdatePayload } from "./userUtils";
import { hashPassword, comparePassword } from "../../helper/password";

export class UserService {
  public static mapUserToDto(user: IUser): UserResponseDto {
    const baseData = {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      tenantId: user.tenantId.toString(),
    };

    return baseData;
  }

  static async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await UserDao.getUserByEmail(
      user.email,
      user.tenantId,
    );

    if (existingUser) {
      throw new ApiError(409, "User Already exists");
    }

    const newUser = await UserDao.createUser(user);

    return this.mapUserToDto(newUser) as UserResponseDto;
  }

  static async getAllUsersByTenant(
    tenantId: string,
  ): Promise<UserResponseDto[]> {
    const allUsers = await UserDao.getAllUsers(tenantId);

    return allUsers.map((user) => this.mapUserToDto(user) as UserResponseDto);
  }

  static async findUserById(
    userId: string,
    tenantId: string,
  ): Promise<IUser | null> {
    return UserDao.getUserById(userId, tenantId);
  }

  static async updateUser(
    data: UserUpdateDto | AdminUpdateDto,
    loggedInUserId: string,
    targetUserId: string,
    tenantId: string,
    loggedInUserRole: UserRole,
  ) {
    // STEP 1: Fetch target user using userId + tenantId (ensures tenant isolation)
    const existingUser = await UserDao.getUserById(targetUserId, tenantId);

    // STEP 2: If user does not exist → throw error
    if (!existingUser) {
      throw new ApiError(404, "User not found or access denied");
    }

    // STEP 3: Authorization check
    // Admin → allowed
    // Normal user → only self-update allowed

    if (loggedInUserRole !== "admin" && loggedInUserId !== targetUserId) {
      throw new ApiError(403, "You are not authorised to update this user");
    }

    // STEP 4: Sanitize payload based on role
    // Removes restricted fields like role, tenantId, etc.
    const cleanData = sanitizeUpdatePayload(data, loggedInUserRole);

    // STEP 5: Check if there is anything valid to update
    if (Object.keys(cleanData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    // STEP 6: Call DAO with safe filter and sanitized data
    const updatedUser = await UserDao.updateUser(
      cleanData,
      targetUserId,
      tenantId,
    );

    // STEP 7: Handle case where update fails (extra safety)
    if (!updatedUser) {
      throw new ApiError(400, "Update failed");
    }

    // STEP 8: Return updated user
    return updatedUser;
  }

  static async changePassword(
    data: UpdatePasswordDto,
    loggedInUserId: string,
    tenantId: string,
  ) {
    // Step 1. Extract the fileds
    const {email, currentPassword, newPassword, confirmPassword } = data;

    // Step 2. Validate the DTO
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ApiError(400, "All fileds are required");
    }

    // Step 3. Compare the new password and confirm password
    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password must match with confirm password");
    }

    // Step 4. Fetch the user
    const user = await UserDao.getUserByEmail(email, tenantId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Step 5. Validate old password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new ApiError(400, "Current password is incorrect");
    }

    // Step 6. Check oldpassword to newPassword
    const isPasswordReused = await comparePassword(newPassword, user.password);

    if (isPasswordReused) {
      throw new ApiError(
        400,
        "New password must be different from current password",
      );
    }

    // Step 7. Hash new Password
    const hasedPassword = await hashPassword(newPassword);

    await UserDao.updatePassword(hasedPassword, loggedInUserId, tenantId);
    // Step 8. Update the Password and Invalidate the session
  }
}
