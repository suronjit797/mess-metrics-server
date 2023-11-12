import { Model, ObjectId } from "mongoose";

export type TMessAccount = {
  meal: number;
  deposit: number;
  individualCost: number;

  
  sharedCost: number;
  totalIndividualCost: number;
  mess: ObjectId;
  month: ObjectId;
};

export type TMessAccountModel = Model<TMessAccount, Record<string, unknown>>;
