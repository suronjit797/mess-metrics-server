import { Schema, model } from "mongoose";
import { TMess, TMessModel } from "./bazar.interface";

const messSchema = new Schema<TMess>(
  {
    name: {
      type: String,
      required: true,
    },
    active_month: {
      type: Schema.Types.ObjectId,
      ref: "Month",
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const MessModel = model<TMess, TMessModel>("Mess", messSchema);

export default MessModel;
