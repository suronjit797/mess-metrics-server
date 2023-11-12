import { Model, ObjectId } from "mongoose";

export type TMessAccount = {
  totalAmount: number;
  totalDeposit: number;
  totalCost: number;
  totalMeal: number;
  totalMealCost: number;
  sharedCost: number;
  totalIndividualCost: number;
  mess: ObjectId;
  month: ObjectId;
};

export type TMessAccountModel = Model<TMessAccount, Record<string, unknown>>;
