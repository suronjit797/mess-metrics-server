import { Model, ObjectId } from "mongoose";

export type TMonth = {
  _id?: ObjectId;
  name: string;
  year: number;
  isActive: boolean;
  mess: ObjectId;
};

export type TMonthModel = Model<TMonth, Record<string, unknown>>;
