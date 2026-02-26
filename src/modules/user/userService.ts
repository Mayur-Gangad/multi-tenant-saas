import { Types } from "mongoose";
import { UserDao } from "./userDao";
import { IUser } from "./userInterface";

export class UserService {
  static async createUser(
    data: IUser,
    tenantId: Types.ObjectId,
  ): Promise<Omit<IUser, "password">> {
    const user = await UserDao.create({ ...data, tenantId });
    const userObj = user.toObject()
    const { password, ...safeUser } = userObj;
    return safeUser;
  }

  static async getUser(
    tenantId: Types.ObjectId,
  ): Promise<Omit<IUser, "password" | "__V">[]> {
    const users = await UserDao.getUserByTenantId(tenantId);
    return users.map(({ password, ...user }) => user);
  }
}
