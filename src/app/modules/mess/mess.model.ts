import { Schema, model } from "mongoose";
import { TMess, TMessModel } from "./mess.interface";
import { userRole } from "../../../constants/userConstants";

const userSchema = new Schema<TMess>(
  {
    name: {
      type: String,
      required: true,
    },
    active_month: {
      type: Schema.Types.ObjectId,
      ref: "Month",
      required: true,
    },
    manager_id:{
      type: Schema.Types.ObjectId,
      ref: "Month",
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Month",
    }]
  },
  { timestamps: true }
);

const MessModel = model<TMess, TMessModel>("Mess", userSchema);

export default MessModel;
