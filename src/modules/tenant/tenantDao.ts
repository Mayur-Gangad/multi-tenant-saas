import { CreateTenantDto } from "./tenantDTO";
import { ITenant } from "./tenantInterface";
import { Tenant } from "./tenantModel";

export class TenantDao {
  static async createTenant(tenant: CreateTenantDto): Promise<ITenant> {
    return Tenant.create(tenant);
  }

  static async findBySubDomain(subDomain: string): Promise<ITenant | null> {
    return Tenant.findOne({ subDomain });
  }

  static async findAllTenants(): Promise<ITenant[]> {
    return Tenant.find().lean();
  }

  static async findTenantBySlug(tenantSlug: string): Promise<ITenant | null> {
    return Tenant.findOne({ subDomain: tenantSlug });
  }
}
