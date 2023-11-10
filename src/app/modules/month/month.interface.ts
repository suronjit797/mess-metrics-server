import { Model, ObjectId } from "mongoose";

export type TMonth = {
  name: string;
  year: number;
  isActive: boolean;
  mess: ObjectId;
};

export type TMonthModel = Model<TMonth, Record<string, unknown>>;
