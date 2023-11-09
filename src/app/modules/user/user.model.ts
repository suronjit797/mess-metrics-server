import { Schema, model } from "mongoose";
import { TUser, TUserModel } from "./user.interface";
import { userRole } from "../../../constants/userConstants";

const userSchema = new Schema<TUser>(
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
    mess_id: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
    },
  },
  { timestamps: true }
);

const UserModel = model<TUser, TUserModel>("User", userSchema);

export default UserModel;
