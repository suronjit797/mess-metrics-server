import { Schema, model } from "mongoose";
import { TMessAccount, TMessAccountModel } from "./messAccount.interface";

const messAccountSchema = new Schema<TMessAccount>(
  {
    totalAmount: { type: Number, required: true, default: 0 },
    totalCost: { type: Number, required: true, default: 0 },
    totalMeal: { type: Number, required: true, default: 0 },
    mealCost: { type: Number, required: true, default: 0 },
    sharedCost: { type: Number, required: true, default: 0 },
    individualCost: { type: Number, required: true, default: 0 },
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
