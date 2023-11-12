import { Model, ObjectId } from "mongoose";

export type TMessAccount = {
  totalAmount: number;
  totalCost: number;
  totalMeal: number;
  mealCost: number;
  sharedCost: number;
  individualCost: number;
  mess: ObjectId;
  month: ObjectId;
};

export type TMessAccountModel = Model<TMessAccount, Record<string, unknown>>;
