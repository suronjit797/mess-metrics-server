import { Schema, model } from "mongoose";
import { TMessAccount, TMessAccountModel } from "./messAccount.interface";

const messAccountSchema = new Schema<TMessAccount>(
  {
    totalAmount: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    totalMeal: { type: Number, default: 0 },
    totalMealCost: { type: Number, default: 0 },
    sharedCost: { type: Number, default: 0 },
    totalIndividualCost: { type: Number, default: 0 },
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

const MessAccountModel = model<TMessAccount, TMessAccountModel>("MessAccount", messAccountSchema);

export default MessAccountModel;
