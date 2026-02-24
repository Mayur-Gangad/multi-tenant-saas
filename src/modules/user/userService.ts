import { UserDao } from "./userDao";
import { IUser } from "./userInterface";

export class UserService {
  static async createUser(
    data: IUser,
    tenantId: any,
  ): Promise<Omit<IUser, "password" | "__V">> {
    const user = await UserDao.create({ ...data, tenantId });
    const userObj = user.toObject();
    const { password, __v, ...safeUser } = userObj;
    return safeUser;
  }

  static async getUser(
    tenantId: string,
  ): Promise<Omit<IUser, "password" | "__V">[]> {
    const users = await UserDao.getUser(tenantId);
    return users.map(({ password, __v, ...user }) => user);
  }
}
