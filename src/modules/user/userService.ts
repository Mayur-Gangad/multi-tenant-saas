import { ApiError } from "../../utils/apiError";
import { UserDao } from "./userDao";
import {
  CreateUserDto,
  UserResponseDto,
} from "./userDTO";
import { IUser } from "./userInterface";

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

 
}
