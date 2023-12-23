import { Schema, model, Types } from "mongoose";
import { TMeal, TMealModel } from "./meal.interface";

const mealSchema = new Schema<TMeal>(
  {
    date: {
      type: String,
      required: true,
    },
    mess: {
      type: Types.ObjectId,
      required: true,
    },
    activeMonth: {
      type: Schema.Types.ObjectId,
      ref: "Month",
      required: true,
    },
    meal: { type: Number, default: 0 },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MealModel = model<TMeal, TMealModel>("Meal", mealSchema);

export default MealModel;
