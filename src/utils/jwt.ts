import jwt from "jsonwebtoken";
import { TokenDto } from "../modules/user/userDTO";
import { jwtConfig } from "../config/jwtConfig";

export class JWT {
  static signAccessToken = (payload: TokenDto): string => {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: "1d",
    });
  };

  static verifyAccessToken = (
    token: string,
  ): TokenDto & { iat?: number; exp?: number } => {
    return jwt.verify(token, jwtConfig.secret) as TokenDto;
  };
}
