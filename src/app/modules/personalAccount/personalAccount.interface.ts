import { Model, ObjectId } from "mongoose";

export type TPersonalAccount = {
  meal: number;
  deposit: number;
  individualCost: number;
  mess: ObjectId;
  month: ObjectId;
};

export type TPersonalAccountModel = Model<TPersonalAccount, Record<string, unknown>>;
