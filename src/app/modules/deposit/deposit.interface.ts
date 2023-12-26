import { Model, ObjectId } from "mongoose";

export type TDeposit = {
  date: string;
  amount: number;
  user: ObjectId;
  manager: ObjectId;
  month: ObjectId;
  mess: ObjectId;
};

export type TDepositModel = Model<TDeposit, Record<string, unknown>>;
