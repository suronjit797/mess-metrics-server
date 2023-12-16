import { Schema, model, Types } from "mongoose";
import { TCreateMeal, TMealModel } from "./mess.interface";

const mealSchema = new Schema<TCreateMeal>(
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
    meal: [
      {
        id: {
          type: Types.ObjectId,
          ref: "User",
        },
        meal: Number,
      },
    ],
  },
  { timestamps: true }
);

const MealModel = model<TCreateMeal, TMealModel>("Meal", mealSchema);

export default MealModel;
