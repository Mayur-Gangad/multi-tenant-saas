import { ApiError } from "../../utils/apiError";
import { AdminUpdateDto, CreateUserDto, UserUpdateDto } from "./userDTO";
import { IUser } from "./userInterface";
import { User } from "./userModel";

export class UserDao {
  private static baseFilter(tenantId: string) {
    return { tenantId, isDeleted: false };
  }

  static async createUser(user: CreateUserDto): Promise<IUser> {
    return User.create(user);
  }

  static async getUserByEmail(
    email: string,
    tenantId: string,
    includePassword: boolean,
  ): Promise<IUser | null> {
    let query = User.findOne({ email:email.toLowerCase(), ...this.baseFilter(tenantId) });

    if (includePassword) {
      query = query.select("+password");
    }

    const user = await query;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  static async getAllUsers(tenantId: string): Promise<IUser[]> {
    return User.find(this.baseFilter(tenantId)).lean();
  }

  static async getUserById(
    userId: string,
    tenantId: string,
    includePassword: boolean,
  ): Promise<IUser | null> {
    let query = User.findOne({ _id: userId, tenantId }).setOptions({
      includeDeleted: true,
    });

    if (includePassword) {
      query = query.select("+password");
    }

    const user = await query;

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  static async updateUser(
    data: Partial<UserUpdateDto & AdminUpdateDto>,
    userId: string,
    tenantId: string,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: userId, ...this.baseFilter(tenantId) },
      {
        $set: data,
      },
      {
        returnDocument: "after",
      },
    );
  }

  static async updatePassword(
    hashedPassword: string,
    userId: string,
    tenantId: string,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: userId, ...this.baseFilter(tenantId) },
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      {
        returnDocument: "after",
      },
    );
  }

  static async deleteUser(
    userId: string,
    tenantId: string,
    deletedBy: string,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: userId, ...this.baseFilter(tenantId) },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
      },
      {
        returnDocument: "after",
      },
    );
  }
}
