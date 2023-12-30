import { Schema, model } from "mongoose";
import { TNotifications, TNotificationsModel } from "./notifications.interface";

const notificationsSchema = new Schema<TNotifications>(
  {
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Schema.Types.ObjectId,
      ref: "Month",
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationsModel = model<TNotifications, TNotificationsModel>("Notifications", notificationsSchema);

export default NotificationsModel;
