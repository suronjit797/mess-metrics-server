import { Schema, model } from "mongoose";
import { TMemberAccount, TMemberAccountModel } from "./userAccount.interface";

const memberAccountSchema = new Schema<TMemberAccount>(
  {
    meal: { type: Number, required: true, default: 0 },
    deposit: { type: Number, required: true, default: 0 },
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MemberAccountModel = model<TMemberAccount, TMemberAccountModel>("MemberAccount", memberAccountSchema);

export default MemberAccountModel;
