import { Types } from "mongoose";

export interface IUser {
  _id?:Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "owner"| "admin"| "manager"| "user"
  status: "active" | "suspended";
  tenantId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


