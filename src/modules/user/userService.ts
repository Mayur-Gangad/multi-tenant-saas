
import { UserDao } from "./userDao";
import { IUser } from "./userInterface";

export class UserService {
  static async createUser(data: IUser, tenantId: any) {
    const user:IUser = await UserDao.create({...data, tenantId});
    return user;
  }
}
