import { ApiError } from "../../utils/apiError";
import { TenantDao } from "./tenantDao";
import { CreateTenantDto, TenantResponseDto } from "./tenantDTO";
import { ITenant } from "./tenantInterface";

export class TenantService {
  public static toTenantResponseDto(tenant: ITenant): TenantResponseDto {
    return {
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
    };
  }
  static async createTenant(
    tenant: CreateTenantDto,
  ): Promise<TenantResponseDto> {
    const existing = await TenantDao.findBySubDomain(tenant.subDomain);

    if (existing) {
      throw new ApiError(409, "Tenant allredy exists");
    }

    const tenantCreated = await TenantDao.createTenant(tenant);

    return TenantService.toTenantResponseDto(tenantCreated);
  }

  static async getAllTenants(): Promise<TenantResponseDto[]> {
    const allTenants = await TenantDao.findAllTenants();

    return allTenants.map(TenantService.toTenantResponseDto);
  }

  static async findTenantBySubDomain(
    tenantSlug: string,
  ): Promise<ITenant | null> {
    return TenantDao.findTenantBySlug(tenantSlug);
  }
}
