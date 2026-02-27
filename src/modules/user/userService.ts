import { ApiError } from "../../utils/apiError";
import { UserDao } from "./userDao";
import {
  CreateUserDto,
  LoginPayloadDto,
  LoginResponseDto,
  UserResponseDto,
} from "./userDTO";
import { IUser } from "./userInterface";

export class UserService {
  
  private static mapUserToDto(
    user: IUser,
    options?: { includePassword?: boolean }
  ): UserResponseDto | LoginResponseDto {
    const baseData = {
      name: user.name,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      tenantId: user.tenantId.toString(),
    };


    if (options?.includePassword) {
      return {
        ...baseData,
        userId: user._id!.toString(),
        password: user.password,
      } as LoginResponseDto;
    }

 
    return {
      ...baseData,
      id: user._id!.toString(),
      email: user.email,
    } as UserResponseDto;
  }


  static async createUser(
    user: CreateUserDto
  ): Promise<UserResponseDto> {
    const existingUser = await UserDao.getUserByEmail(
      user.email,
      user.tenantId
    );

    if (existingUser) {
      throw new ApiError(409, "User Already exists");
    }

    const newUser = await UserDao.createUser(user);

    return this.mapUserToDto(newUser) as UserResponseDto;
  }


  static async getAllUsersByTenant(
    tenantId: string
  ): Promise<UserResponseDto[]> {
    const allUsers = await UserDao.getAllUsers(tenantId);

    return allUsers.map((user) =>
      this.mapUserToDto(user) as UserResponseDto
    );
  }

  static async checkUser(
    user: LoginPayloadDto
  ): Promise<LoginResponseDto> {
    const existingUser = await UserDao.getUserByEmail(
      user.email,
      user.tenantId
    );

    if (!existingUser) {
      throw new ApiError(404, `No user found with ${user.email}`);
    }

    return this.mapUserToDto(existingUser, {
      includePassword: true,
    }) as LoginResponseDto;
  }
}