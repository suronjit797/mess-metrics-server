import { Schema, model } from "mongoose";
import { TMonth, TMonthModel } from "./month.interface";

const monthSchema = new Schema<TMonth>(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },
  },
  { timestamps: true }
);

const MonthModel = model<TMonth, TMonthModel>("Month", monthSchema);

export default MonthModel;
