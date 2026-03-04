import { ITenant } from "../modules/tenant/tenantInterface";
import { AccessTokenDto } from "../modules/user/userDTO";

declare global {
  //I want to modify an existing global type
  namespace Express {
    interface Request {
      //We are extending that same interface.
      tenant?: ITenant;
      user?: AccessTokenDto;
      //Add a new property called tenant to Express Request
    }
  }
}

export {};
