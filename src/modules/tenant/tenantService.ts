import { ApiError } from "../../utils/apiError";
import { TenantDao } from "./tenantDao";
import { CreateTenantDto, TenantResponseDto } from "./tenantDTO";

export class TenantService {
  static async createTenant(
    tenant: CreateTenantDto,
  ): Promise<TenantResponseDto> {
    const existing = await TenantDao.findBySubDomain(tenant.subDomain);

    if (existing) {
      throw new ApiError(409, "Tenant allredy exists");
    }

    const tenantCreated = await TenantDao.createTenant(tenant);

    return {
      id: tenantCreated._id.toString(),
      name: tenantCreated.name,
      subDomain: tenantCreated.subDomain,
      contactEmail: tenantCreated.contactEmail,
      contactPhone: tenantCreated.contactPhone,
      address: tenantCreated.address,
      status: tenantCreated.status,
      plan: tenantCreated.plan,
      createdAt: tenantCreated.createdAt.toISOString(),
      updatedAt: tenantCreated.updatedAt.toISOString(),
    };
  }

  static async getAllTenants(): Promise<TenantResponseDto[]> {
    const allTenants = await TenantDao.findAllTenants();
    return allTenants.map((tenant)=>({
     id: tenant._id.toString(),
      name: tenant.name,
      subDomain: tenant.subDomain,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
      address: tenant.address,
      status: tenant.status,
      plan: tenant.plan,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    }))
  }
}
