import { Types } from "mongoose";

export interface IUser {
  [x: string]: any;
  name: string;
  email: string;
  password?: string;
  role?: "owner" | "admin" | "manager" | "user";
  status?: "active" | "inactive";

  tenantId?: Types.ObjectId;
}


