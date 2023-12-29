import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MonthModel from "./month.model";
import { TMonth } from "./month.interface";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import MessModel from "../mess/mess.model";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import UserModel from "../user/user.model";
import MemberAccountModel from "../memberAccount/memberAccount.model";

export const create_service: any = async (
  payload: Partial<TMonth>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMonth | null> => {
  // start session
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log({ user });

  if (!user.mess) {
    throw new Error("User is not in a mess");
  }

  const mess = await MessModel.findById(user.mess);
  if (!mess) {
    throw new Error("Mess is not exist");
  }

  try {
    await MonthModel.updateMany({ mess: user.mess }, { $set: { isActive: false } }, { session });

    const body = { ...payload };
    if (!body.mess) {
      body.mess = user.mess;
    }

    const month = await MonthModel.create([body], { session });
    const users = await UserModel.find({ mess: body.mess });

    // Create default MessAccount entries for each user
    const memberAccountEntries = users.map((u) => ({
      month: month[0]._id,
      mess: user.mess,
      user: u._id,
    }));

    await MemberAccountModel.create(memberAccountEntries, { session });
    await UserModel.updateMany({ mess: mess._id }, { $set: { activeMonth: month[0]._id } }, { session });

    await session.commitTransaction();
    session.endSession();

    return month[0];
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();

    throw new Error(error as any);
  }
};
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MonthModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MonthModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<TMonth | null> => {
  const data = await MonthModel.findById(id).populate("mess");
  return data;
};
export const update_service = async (id: string, payload: TMonth): Promise<TMonth | null> => {
  return await MonthModel.findByIdAndUpdate(id, payload, { new: true });
};
export const remove_service = async (id: string): Promise<any> => {
  const data = await MonthModel.findByIdAndDelete(id);
  await MemberAccountModel.deleteMany({ month: id });
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await MonthModel.deleteMany({ _id: { $in: ids } });
  await MemberAccountModel.deleteMany({ month: { $in: ids } });
  return data;
};

export const getMessMonth_service = async (filter: any, pagination: IPagination): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;

  console.log({ sortCondition });
  const memberAccount = await MemberAccountModel.find(filter)
    .limit(limit)
    .skip(skip)
    .select("month")
    .sort(sortCondition)
    .populate({ path: "month" });
  const data: any = memberAccount.map((d) => d.month);

  const total = await MemberAccountModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

export const getMessActiveMonth_service = async (id: string): Promise<TMonth | null> => {
  const data = await MonthModel.findOne({ mess: id, isActive: true });
  return data;
};

export const switchActiveMonth_service = async (monthId: string, userId: string): Promise<TMonth | null> => {
  const month = await MonthModel.findById(monthId);
  if (!month) {
    throw new ApiError(httpStatus.NOT_FOUND, "Month is not exist");
  }

  const data = await UserModel.findByIdAndUpdate(userId, { $set: { activeMonth: monthId } }, { new: true });
  return month;
};
