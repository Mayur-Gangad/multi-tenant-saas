import { ITenant } from "../modules/tenant/tenantInterface";
import { TokenDto } from "../modules/user/userDTO";

declare global {
  //I want to modify an existing global type
  namespace Express {
    interface Request {
      //We are extending that same interface.
      tenant?: ITenant;
      user?: TokenDto;
      //Add a new property called tenant to Express Request
    }
  }
}

export {};
