import { Types } from "mongoose";

export interface ITenant {
  _id: Types.ObjectId;
  name: string;
  subDomain: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: "active" | "suspended";
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;

}
