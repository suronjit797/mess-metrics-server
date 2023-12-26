import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MessModel from "./mess.model";
import { TMess } from "./mess.interface";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";
import PhoneBookModel from "../phoneBook/phoneBook.model";
import MonthModel from "../month/month.model";
import { TUser } from "../user/user.interface";
import * as month from "../month/month.service";
import mongoose from "mongoose";
import MemberAccountModel from "../memberAccount/memberAccount.model";

const { ObjectId } = mongoose.Types;

export const create_service = async (body: any, user: CustomJwtPayload | JwtPayload): Promise<TMess | null> => {
  // check if already in mess
  const manager = await UserModel.findById(user.userId);
  if (!manager) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
  }
  if (manager.mess) {
    const mess = await MessModel.findById(user.mess);
    if (mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You are already in a mess");
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newMess = {
      name: body.name,
      manager: user.userId,
      members: [user.userId],
    };

    // create mess
    const data = await MessModel.create([newMess], { session });
    // update user
    const updateUserBody = { mess: data[0]._id, role: userRole.manager };
    const updatedUser = await UserModel.findByIdAndUpdate(user.userId, updateUserBody, { new: true, session });

    // add in phone book
    const newPhoneBook = { user: manager._id, name: manager.name, phone: manager.phone, mess: data[0]._id };
    await PhoneBookModel.create([newPhoneBook], { session });

    await session.commitTransaction();
    session.endSession();

    await month.create_service({ name: body.month }, updatedUser);

    return data[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error as "string | undefined");
  }
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MessModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MessModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

export const getSingle_service = async (id: string): Promise<TMess | null> => {
  const data = await MessModel.findById(id).populate([
    { path: "manager", select: "-password" },
    { path: "members", select: "-password" },
  ]);
  return data;
};

// ! have to remove json size mess,month

export const getMessMembersWithServices_service = async (user: CustomJwtPayload | JwtPayload): Promise<TUser[]> => {
  if (user.mess && user.activeMonth) {
    try {
      const membersWithMeals = await MemberAccountModel.aggregate([
        {
          $match: { mess: user.mess, month: user.activeMonth },
        },
        {
          $lookup: {
            from: "meals",
            let: { userId: "$user", mess: user.mess, activeMonth: user.activeMonth },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$mess", "$$mess"] },
                      { $eq: ["$activeMonth", "$$activeMonth"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$user",
                  totalMeals: { $sum: "$meal" },
                },
              },
            ],
            as: "meals",
          },
        },
        {
          $lookup: {
            from: "deposits",
            let: { userId: "$user", mess: user.mess, activeMonth: user.activeMonth },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$mess", "$$mess"] },
                      { $eq: ["$month", user.activeMonth] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$user",
                  amount: { $sum: "$amount" },
                },
              },
            ],
            as: "deposits",
          },
        },
        {
          $lookup: {
            from: "individualcosts",
            let: { userId: "$user", mess: user.mess, activeMonth: user.activeMonth },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$mess", "$$mess"] },
                      { $eq: ["$month", user.activeMonth] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$user",
                  amount: { $sum: "$amount" },
                },
              },
            ],
            as: "individualCost",
          },
        },

        // general look up
        {
          $lookup: {
            from: "messes",
            localField: "mess",
            foreignField: "_id",
            as: "mess",
          },
        },
        {
          $lookup: {
            from: "months",
            localField: "month",
            foreignField: "_id",
            as: "month",
            pipeline: [{ $project: { name: 1, year: 1, isActive: 1 } }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [{ $project: { name: 1, email: 1, phone: 1, role: 1, dateOfBirth: 1 } }],
          },
        },

        {
          $addFields: {
            meal: { $arrayElemAt: ["$meals.totalMeals", 0] },
            deposit: { $arrayElemAt: ["$deposits.amount", 0] },
            individualCost: { $arrayElemAt: ["$individualCost.amount", 0] },
            user: { $arrayElemAt: ["$user", 0] },
            mess: { $arrayElemAt: ["$mess.name", 0] },
            month: { $arrayElemAt: ["$month", 0] },
          },
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            meals: 0,
            deposits: 0,
          },
        },
      ]);

      return membersWithMeals;
    } catch (error) {
      console.error("Error fetching mess members with meals:", error);
      throw error;
    }
  }
  return [];
};

export const getMessMembers_service = async (user: CustomJwtPayload | JwtPayload): Promise<TUser[]> => {
  if (user.mess) {
    return await UserModel.find({ mess: user.mess }).select({ password: 0 });
  }
  return [];
};

export const update_service = async (id: string, payload: TMess): Promise<TMess | null> => {
  const data = await MessModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await MessModel.findByIdAndDelete(id);
  await UserModel.updateMany({ mess: id }, { mess: null, role: userRole.member });
  await MonthModel.deleteMany({ mess: id });
  await PhoneBookModel.deleteMany({ mess: id });
  return data;
};

export const removeMany_service = async (ids: string[], user: JwtPayload | CustomJwtPayload): Promise<any> => {
  const data = await MessModel.deleteMany(ids);
  return data;
};

export const removeMember_service = async (
  id: string,
  membersIds: string[],
  user: JwtPayload | CustomJwtPayload
): Promise<any> => {
  const isMessExist = await MessModel.findById(id);

  if (!isMessExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mess not found");
  }

  const manager = await UserModel.find({ _id: { $in: membersIds }, role: userRole.manager });

  if (manager?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Manager cannot be removed");
  }

  await UserModel.updateMany({ _id: membersIds }, { mess: null });
  const data = await MessModel.findByIdAndUpdate(id, { $pull: { members: { $in: membersIds } } }, { new: true });
  await PhoneBookModel.deleteMany({ user: membersIds });
  await MemberAccountModel.deleteMany({ user: membersIds, month: user.activeMonth, mess: user.mess });
  return data;
};

export const addMember_service = async (
  id: string,
  payload: { email: string; phone: string },
  user: CustomJwtPayload | JwtPayload
): Promise<TMess | null> => {
  const isMessExist = await MessModel.findById(id);

  if (!isMessExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mess not found");
  }
  const member = await UserModel.findOne(payload);

  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, "Member not found");
  }
  if (member?.mess) {
    const mess = await MessModel.findById(member?.mess);
    if (mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Member already in a mess");
    }
  }

  await UserModel.findByIdAndUpdate(member._id, { mess: id });

  const memberAccountEntries = {
    month: user.activeMonth,
    mess: user.mess,
    user: member._id,
  };

  await MemberAccountModel.create(memberAccountEntries);

  const data = await MessModel.findByIdAndUpdate(id, { $push: { members: member._id } }, { new: true });

  if (!data) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error  ");
  }

  const newPhoneBook = { user: member._id, name: member.name, phone: member.phone, mess: data._id };
  await PhoneBookModel.create(newPhoneBook);

  return data;
};

export const changeManager_service = async (
  messId: string,
  managerId: string,
  newManagerId: string
): Promise<TMess | null> => {
  const isMessExist = await MessModel.findById(messId);
  if (!isMessExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mess not found");
  }

  const managerExist = await UserModel.findById(managerId);
  if (!managerExist || managerExist.role !== userRole.manager) {
    throw new ApiError(httpStatus.NOT_FOUND, "Manager not found");
  }

  const newManagerExist = await UserModel.findById(newManagerId);
  if (!newManagerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "New Manager not found");
  }

  const isNewManagerInMess = await MessModel.find({ _id: messId, members: { $in: newManagerId } });
  if (!isNewManagerInMess?.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "New Manager is not exist in your mess");
  }

  await UserModel.findByIdAndUpdate(managerId, { role: userRole.member });
  await UserModel.findByIdAndUpdate(newManagerId, { role: userRole.manager });
  const data = await MessModel.findByIdAndUpdate(messId, { manager: newManagerId }, { new: true });
  return data;
};
