import { Schema, model } from "mongoose";
import { TMessAccount, TMessAccountModel } from "./userAccount.interface";

const messAccountSchema = new Schema<TMessAccount>(
  {
    totalAmount: { type: Number, required: true, default: 0 },
    totalCost: { type: Number, required: true, default: 0 },
    totalMeal: { type: Number, required: true, default: 0 },
    totalMealCost: { type: Number, required: true, default: 0 },
    sharedCost: { type: Number, required: true, default: 0 },
    totalIndividualCost: { type: Number, required: true, default: 0 },
    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },
    month: {
      type: Schema.Types.ObjectId,
      ref: "Month",
      required: true,
    },
  },
  { timestamps: true }
);

const MessAccountModel = model<TMessAccount, TMessAccountModel>("Mess", messAccountSchema);

export default MessAccountModel;
