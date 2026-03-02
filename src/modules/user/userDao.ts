import { CreateUserDto } from "./userDTO";
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
    return User.findOne({ email, tenantId });
  }

  static async getAllUsers(tenantId: string): Promise<IUser[]> {
    return User.find({ tenantId });
  }
}
