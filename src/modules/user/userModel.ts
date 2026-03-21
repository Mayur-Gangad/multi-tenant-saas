import { Query, Schema, model } from "mongoose";
import { IUser } from "./userInterface";
import { hashPassword } from "../../helper/password";

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

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;
  this.password = await hashPassword(this.password);
});

userSchema.pre(/^find/, async function (this: Query<any, any>) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);
