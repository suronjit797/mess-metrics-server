import { Model, ObjectId } from "mongoose";

export type TBazar = {
  date: string;
  amount: number;
  list?: string;
  members: ObjectId[];
  manager: ObjectId;
  month: ObjectId;
  mess: ObjectId;
};

export type TBazarModel = Model<TBazar, Record<string, unknown>>;
