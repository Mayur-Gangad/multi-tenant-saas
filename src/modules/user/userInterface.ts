import { Types } from "mongoose";

export interface IUser {
  _id?:Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isDeleted:boolean,
  role: "owner"| "admin"| "manager"| "user"
  status: "active" | "suspended";
  tenantId: Types.ObjectId;
  passwordChangedAt:Date,
  createdAt: Date;
  updatedAt: Date;
}


