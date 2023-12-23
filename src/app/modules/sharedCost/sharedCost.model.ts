import { Schema, model } from "mongoose";
import { TSharedCost, TSharedCostModel } from "./sharedCost.interface";

const sharedCostSchema = new Schema<TSharedCost>(
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
  },
  { timestamps: true }
);

const SharedCostModel = model<TSharedCost, TSharedCostModel>("SharedCost", sharedCostSchema);

export default SharedCostModel;
