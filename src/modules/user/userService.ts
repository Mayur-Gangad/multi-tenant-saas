import { ApiError } from "../../utils/apiError";
import { UserDao } from "./userDao";
import { CreateUserDto, UserResponseDto } from "./userDTO";
import { IUser } from "./userInterface";

export class UserService {
  private static toResponseDto(user: IUser): UserResponseDto {
    return {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      tenantId: user.tenantId.toString(),
    };
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

    return UserService.toResponseDto(newUser);
  }

  static async getAllUsersByTenant(
    tenantId: string,
  ): Promise<UserResponseDto[]> {
    const allUsers = await UserDao.getAllUsers(tenantId);

    return allUsers.map(UserService.toResponseDto);
  }
}
