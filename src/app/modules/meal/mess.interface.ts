import { Model, ObjectId } from "mongoose";

export type meal = { id: string; meal: number };

export type TCreateMeal = {
  date: string;
  meal: meal[];
};

export type TMealModel = Model<TCreateMeal, Record<string, unknown>>;