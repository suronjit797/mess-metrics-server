import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import NotificationsModel from "./notifications.model";
import { TNotifications } from "./notifications.interface";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";

export const create_service = async (
  body: Partial<TNotifications>,
  user: CustomJwtPayload | JwtPayload
): Promise<TNotifications | null> => {
  const isUser = await UserModel.findById(body.user);

  if (!isUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user");
  }

  const payload = { ...body, manager: user.userId, month: user.activeMonth, mess: user.mess };
  const data = await NotificationsModel.create(payload);
  return data;
};

// ! only access own mess
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await NotificationsModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await NotificationsModel.countDocuments(filter);
  const unread = await NotificationsModel.countDocuments({ ...filter, isRead: false });
  return { data, unread, meta: { page, limit, total } };
};

// ! only access own mess
export const getSingle_service = async (id: string): Promise<TNotifications | null> => {
  const data = await NotificationsModel.findById(id).populate([
    {
      path: "month",
      select: "name year isActive",
    },
    {
      path: "user",
      select: "name email phone",
    },
    {
      path: "manager",
      select: "name email phone",
    },
    {
      path: "mess",
      select: "name ",
    },
  ]);
  return data;
};

export const update_service = async (id: string, payload: Partial<TNotifications>): Promise<TNotifications | null> => {
  const data = await NotificationsModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await NotificationsModel.findByIdAndDelete(id);
  console.log(data);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await NotificationsModel.deleteMany(ids);
  return data;
};

export const readAll_service = async (filter: any): Promise<any> => {
  const data = await NotificationsModel.updateMany(filter, { isRead: true }, { new: true });

  return data;
};
