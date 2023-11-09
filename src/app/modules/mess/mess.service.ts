import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MessModel from "./mess.model";
import { TMess } from "./mess.interface";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";

export const create_service = async (
  body: Partial<TMess>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMess | null> => {
  const session = await UserModel.startSession();
  session.startTransaction();

  try {
    const manager = await UserModel.findById(user.userId).session(session);
    if (!manager) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
    }
    if (manager.mess_id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You are already in a mess");
    }

    const newMess = {
      name: body.name,
      manager_id: user.userId,
      members: [user.userId],
    };

    const data = await MessModel.create([newMess], { session });

    // update user
    const updateUserBody = { mess_id: data[0]._id, role: userRole.manager };
    await UserModel.findByIdAndUpdate(user.userId, updateUserBody, { new: true, session });

    await session.commitTransaction();
    session.endSession();

    return data[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MessModel.find(filter).limit(limit).skip(skip).sort(sortCondition).select({ password: 0 });
  const total = await MessModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<TMess | null> => {
  const data = await MessModel.findById(id).select({ password: 0 });
  return data;
};
export const update_service = async (id: string, payload: TMess): Promise<TMess | null> => {
  const data = await MessModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<TMess | null> => {
  const data = await MessModel.findByIdAndDelete(id);
  return data;
};
