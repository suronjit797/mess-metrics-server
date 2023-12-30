import { Model, ObjectId } from "mongoose";

export type TNotifications = {
  _id?: ObjectId;
  message?: string;
  isRead?: boolean;
  user: ObjectId;
  manager: ObjectId;
  month: ObjectId;
  mess: ObjectId;
};

export type TNotificationsModel = Model<TNotifications, Record<string, unknown>>;
