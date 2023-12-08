import { Schema, model } from "mongoose";
import { TCreateMeal, TMealModel } from "./mess.interface";

const mealSchema = new Schema<TCreateMeal>(
  {
    date: {
      type: String,
      required: true,
    },
    meal: [
      {
        id: String,
        meal: Number,
      },
    ],
  },
  { timestamps: true }
);

const MealModel = model<TCreateMeal, TMealModel>("Meal", mealSchema);

export default MealModel;
