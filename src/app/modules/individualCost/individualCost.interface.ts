import { Model, ObjectId } from "mongoose";

export type TIndividualCost = {
  date: string;
  amount: number;
  list?: string;
  user: ObjectId;
  manager: ObjectId;
  month: ObjectId;
  mess: ObjectId;
};

export type TIndividualCostModel = Model<TIndividualCost, Record<string, unknown>>;
