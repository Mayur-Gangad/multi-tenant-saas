import { model, Schema, HydratedDocument } from "mongoose";
import { ITenant } from "./tenantInterface";

export type TenantDocument = HydratedDocument<ITenant>;

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subDomain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Tenant = model<ITenant>("Tenant", tenantSchema);
