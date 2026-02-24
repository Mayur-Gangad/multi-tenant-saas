import { User } from "./userModel";
import { IUser } from "./userInterface";

export class UserDao {
  static async create(data: IUser): Promise<IUser> {
    return User.create(data);
  }

  static async getUser(tenantId: string): Promise<IUser[]> {
    const user: IUser[] = await User.find({ tenantId }).lean();
    return user;
  }
}
