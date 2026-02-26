export type UserStatus = "active" | "suspended";
export type UserRole = "owner" | "admin" | "manager" | "user";

export interface BaseUserDto {
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto extends BaseUserDto {
  tenant: string;
  password: string;
  tenantId: string;
}

export interface UserResponseDto extends BaseUserDto {
  id: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  tenantId: string; //expecting from request he
}
