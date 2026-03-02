export type TenantStatus = "active" | "suspended";
export type TenantPlan = "free" | "pro" | "enterprise";

export interface BaseTenantDto {
  name: string;
  subDomain: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}
export interface CreateTenantDto extends BaseTenantDto {}

export interface TenantResponseDto extends BaseTenantDto {
  id: string;
  status: TenantStatus;
  plan: TenantPlan;
  createdAt: string;
  updatedAt: string;
}
