export interface RegisterTenantDto {
  tenant: {
    name: string;
    subDomain: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };

  adminUser: {
    name: string;
    email: string;
    password: string;
  };
}

export interface RegisterResponseDto {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
}
