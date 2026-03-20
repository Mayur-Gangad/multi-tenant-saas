import { AdminUpdateDto, CreateUserDto, UserUpdateDto } from "./userDTO";
import { IUser } from "./userInterface";
import { User } from "./userModel";

export class UserDao {
  static async createUser(user: CreateUserDto): Promise<IUser> {
    return User.create(user);
  }

  static async getUserByEmail(
    email: string,
    tenantId: string,
  ): Promise<IUser | null> {
    return User.findOne({ email, tenantId }).select("+password");
  }

  static async getAllUsers(tenantId: string): Promise<IUser[]> {
    return User.find({ tenantId }).lean();
  }

  static async getUserById(
    userId: string,
    tenantId: string,
  ): Promise<IUser | null> {
    return User.findOne({ _id: userId, tenantId: tenantId });
  }

  static async updateUser(
    data: Partial<UserUpdateDto & AdminUpdateDto>,
    userId: string,
    tenantId: string,
  ) {

    return User.findOneAndUpdate(
      { _id: userId, tenantId: tenantId },
      {
        $set: data,
      },
      {
        returnDocument:"after",
      },
    );
  }
}
