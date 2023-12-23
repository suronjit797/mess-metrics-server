import { Schema, model } from "mongoose";
import { TBazar, TBazarModel } from "./bazar.interface";

const bazarSchema = new Schema<TBazar>(
  {
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    list: {
      type: String,
    },
    month: {
      type: Schema.Types.ObjectId,
      ref: "Month",
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
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

const BazarModel = model<TBazar, TBazarModel>("Bazar", bazarSchema);

export default BazarModel;
