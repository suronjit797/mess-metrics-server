import { Model, ObjectId } from "mongoose";

export type TSharedCost = {
  date: string;
  amount: number;
  list?: string;
  manager: ObjectId;
  month: ObjectId;
  mess: ObjectId;
};

export type TSharedCostModel = Model<TSharedCost, Record<string, unknown>>;
