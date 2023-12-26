import { Schema, model } from "mongoose";
import { TDeposit, TDepositModel } from "./deposit.interface";

const depositSchema = new Schema<TDeposit>(
  {
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const DepositModel = model<TDeposit, TDepositModel>("Deposit", depositSchema);

export default DepositModel;
