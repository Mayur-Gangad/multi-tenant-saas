import { Schema, model } from "mongoose";
import {ITenant} from "./tenantInterface";

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
    status:{
        type:String,
        enum:["active", "suspended"],
        default:"active"
    },
    plan:{
        type:String,
        enum:["free","pro","enterprise"]
    }
  },
  {
    timestamps: true,
  },
);

export const Tenant = model<ITenant>("Tenant", tenantSchema);
