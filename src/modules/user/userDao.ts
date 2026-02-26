import { User } from "./userModel";
import { IUser } from "./userInterface";
import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";

export class UserDao {
  static async create(data: IUser): Promise<HydratedDocument<IUser>> {
    const user = await User.create(data);
    return user
  }

  static async getUserByTenantId(tenantId: Types.ObjectId): Promise<IUser[]> {
    const user = await User.find({ tenantId }).lean();
    return user;
  }

  static async getUserByEmail(
    email: string,
  ): Promise<Pick<
    IUser,
    "password" | "email" | "_id" | "role" | "tenantId"
  > | null> {
    const user = await User.findOne({ email })
      .select("password email _id role tenantId")
      .lean();
    return user;
  }
}
