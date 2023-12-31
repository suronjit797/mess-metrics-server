import { Model, ObjectId } from "mongoose";

export type TMess = {
  name: string;
  members: ObjectId[];
  manager: ObjectId;
  active_month: ObjectId;
};

export type TMessModel = Model<TMess, Record<string, unknown>>;
