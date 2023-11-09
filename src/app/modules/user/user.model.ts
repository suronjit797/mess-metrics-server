import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import { userRole } from "../../../constants/userConstants";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(userRole),
      default: "member",
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser, UserModel>("User", userSchema);

export default UserModel;
