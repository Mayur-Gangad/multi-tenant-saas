import bcrypt from "bcrypt";
import { UserDao } from "../user/userDao";
import { ApiError } from "../../utils/apiError";
import { JWT } from "../../utils/jwt";

export class AuthService {
  static async login(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<string> {
    const user = await UserDao.getUserByEmail(email, tenantId);

    if (!user || !user.password) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = JWT.signAccessToken({
      userId: user._id!.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    });

    return token;
  }
}
