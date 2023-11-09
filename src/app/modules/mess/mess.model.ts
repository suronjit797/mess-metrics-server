import { Schema, model } from "mongoose";
import { IMess, IMessModel } from "./mess.interface";
import { userRole } from "../../../constants/userConstants";

const userSchema = new Schema<IMess>(
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

const UserModel = model<IMess, IMessModel>("User", userSchema);

export default IMessModel;
