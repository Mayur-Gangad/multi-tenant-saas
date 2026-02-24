import { ITenant } from "./tenantInterface";
import { Tenant } from "./tenantModel";

export class TenantDao {
  static async findByDomain(subDomain: string): Promise<ITenant | null> {
    return Tenant.findOne({ subDomain });
  }

  static async createTenant(tenant:ITenant):Promise<ITenant>{
        return Tenant.create(tenant)
  }
}
