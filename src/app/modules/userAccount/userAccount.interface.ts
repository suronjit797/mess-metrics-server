import { Model, ObjectId } from "mongoose";

export type TMessAccount = {
  totalAmount: number;
  totalCost: number;
  totalMeal: number;
  totalMealCost: number;
  sharedCost: number;
  sharedCostPerson: number;
  totalIndividualCost: number;
  mess: ObjectId;
  month: ObjectId;
};

export type TMessAccountModel = Model<TMessAccount, Record<string, unknown>>;
