import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MessModel from "./bazar.model";
import { TMess } from "./bazar.interface";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";
import PhoneBookModel from "../phoneBook/phoneBook.model";

export const create_service = async (
  body: Partial<TMess>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMess | null> => {
  // check if already in mess
  const manager = await UserModel.findById(user.userId);
  if (!manager) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
  }
  if (manager.role !== userRole.manager || manager.role !== userRole.member) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Only members or managers can create mess");
  }
  if (manager.mess) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are already in a mess");
  }

  const session = await UserModel.startSession();
  session.startTransaction();

  try {
    const newMess = {
      name: body.name,
      manager: user.userId,
      members: [user.userId],
    };

    const data = await MessModel.create([newMess], { session });

    // update user
    const updateUserBody = { mess: data[0]._id, role: userRole.manager };
    await UserModel.findByIdAndUpdate(user.userId, updateUserBody, { new: true, session });

    const newPhoneBook = { user: manager._id, name: manager.name, number: manager.phone, mess: data[0]._id };
    console.log(newPhoneBook);
    await PhoneBookModel.create([newPhoneBook], { session });
    console.log(newPhoneBook);

    await session.commitTransaction();
    session.endSession();

    return data[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error  ");
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
export const update_service = async (id: string, payload: TMess): Promise<TMess | null> => {
  const data = await MessModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<TMess | null> => {
  const data = await MessModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await MessModel.deleteMany(ids);
  return data;
};

export const removeMember_service = async (id: string, membersIds: string[]): Promise<any> => {
  const isMessExist = await MessModel.findById(id);

  if (!isMessExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mess not found");
  }

  const user = await UserModel.find({ _id: { $in: membersIds }, role: userRole.manager });

  if (user?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Manager cannot be removed");
  }
  await UserModel.updateMany({ _id: membersIds }, { mess: "" });
  const data = await MessModel.findByIdAndUpdate(id, { $pull: { members: { $in: membersIds } } }, { new: true });
  await PhoneBookModel.deleteMany({ user: membersIds });
  return data;
};

export const addMember_service = async (
  id: string,
  payload: { email: string; phone: string }
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
    throw new ApiError(httpStatus.BAD_REQUEST, "Member already in a mess");
  }

  await UserModel.findByIdAndUpdate(member._id, { mess: id });

  const data = await MessModel.findByIdAndUpdate(id, { $push: { members: member._id } }, { new: true });

  if (!data) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error  ");
  }

  const newPhoneBook = { user: member._id, name: member.name, number: member.phone, mess: data._id };
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
