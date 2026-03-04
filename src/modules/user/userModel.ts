import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./userInterface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (!this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);
