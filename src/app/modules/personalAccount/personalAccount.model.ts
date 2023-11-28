import { Schema, model } from "mongoose";
import { TPersonalAccount, TPersonalAccountModel } from "./personalAccount.interface";

const PersonalAccountSchema = new Schema<TPersonalAccount>(
  {
    meal: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    individualCost: {
      type: Number,
      default: 0,
    },
    mess: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "mess",
    },
    month: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "month",
    },
  },
  { timestamps: true }
);

const PersonalAccountModel = model<TPersonalAccount, TPersonalAccountModel>("PersonalAccount", PersonalAccountSchema);

export default PersonalAccountModel;
