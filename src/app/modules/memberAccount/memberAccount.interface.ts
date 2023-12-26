import { Model, ObjectId } from "mongoose";

export type TMemberAccount = {
  meal?: number;
  deposit?: number;
  individualCost?: number;
  mess: ObjectId;
  month: ObjectId;
  user: ObjectId;
};

export type TMemberAccountModel = Model<TMemberAccount, Record<string, unknown>>;
