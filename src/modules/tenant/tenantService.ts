import { ApiError } from "../../utils/apiError";
import { TenantDao } from "./tenantDao";
import { ITenant } from "./tenantInterface";

export class TenantService {
  static async createTenant(tenantData: ITenant) {
    const existing = await TenantDao.findByDomain(tenantData.subDomain);

    if (existing) {
      throw new ApiError(409, "Domain already exists");
    }

    return TenantDao.createTenant(tenantData);
  }
}
