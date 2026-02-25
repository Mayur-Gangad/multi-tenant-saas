import { ITenant } from "../modules/tenant/tenantInterface";

declare global {  //I want to modify an existing global type
  namespace Express {
    interface Request {  //We are extending that same interface.
      tenant?: ITenant;  //Add a new property called tenant to Express Request
    }
  }
}


export {}