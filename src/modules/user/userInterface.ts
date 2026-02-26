import { Types } from "mongoose";

export interface IUser {
  _id?:Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: string
  status?: string;
  tenantId?: Types.ObjectId;
}


