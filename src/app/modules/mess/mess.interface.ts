import { Model, ObjectId } from "mongoose";

export type IMess = {
  name: string;
  members: ObjectId[];
  manager_id: ObjectId;
  active_month: ObjectId;
};

export type IMessModel = Model<IMess, Record<string, unknown>>;
