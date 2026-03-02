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

export interface LoginPayloadDto {
  email: string;
  password: string;
  tenant: string;
  tenantId: string;
  role: string;
}

export interface LoginResponseDto {
  userId: string;
  name: string;
  password: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  role: UserRole;
}

export type TokenDto = Pick<LoginResponseDto, "userId" | "tenantId" | "role">;
