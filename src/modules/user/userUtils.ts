import { ApiError } from "../../utils/apiError";
import { AdminUpdateDto, UserRole, UserUpdateDto } from "./userDTO";

export const sanitizeUpdatePayload = (
  data: UserUpdateDto | AdminUpdateDto,
  role: UserRole,
) => {
  const USER_ALLOWED_FIELDS = ["name", "email"];
  const ADMIN_ALLOWED_FIELDS = ["name", "email", "role"];
  const OWNER_ALLOWED_FIELDS = ["name", "email", "role"];

  let allowedFields: string[] = [];
  switch (role) {
    case "admin":
      allowedFields = ADMIN_ALLOWED_FIELDS;
      break;
    case "owner":
      allowedFields = OWNER_ALLOWED_FIELDS;
      break;
    case "user":
      allowedFields = USER_ALLOWED_FIELDS;
      break;
    default:
      allowedFields = [];
  }

  const sanitizedData: Partial<UserUpdateDto | AdminUpdateDto> = {};

  for (const key of Object.keys(data)) {
    if (allowedFields.includes(key)) {
      sanitizedData[key as keyof typeof sanitizedData] =
        data[key as keyof typeof data];
    }
  }

  return sanitizedData;
};

export const parseUserRole = (role: string): UserRole => {
  if (role === "owner" || role === "user" || role === "admin") {
    return role as UserRole;
  }

  throw new ApiError(403, "Invalid user role");
};
