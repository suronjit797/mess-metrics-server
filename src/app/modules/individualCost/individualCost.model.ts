import { Schema, model } from "mongoose";
import { TIndividualCost, TIndividualCostModel } from "./individualCost.interface";

const individualCostSchema = new Schema<TIndividualCost>(
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

const IndividualCostModel = model<TIndividualCost, TIndividualCostModel>("IndividualCost", individualCostSchema);

export default IndividualCostModel;
