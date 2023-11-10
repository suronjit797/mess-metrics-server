import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import PhoneBookModel from "./phoneBook.model";
import { TPhoneBook } from "./phoneBook.interface";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";

export const create_service = async (body: Partial<TPhoneBook>): Promise<TPhoneBook | null> => {
  const data = await PhoneBookModel.create(body);
  return data;
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await PhoneBookModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await PhoneBookModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

export const getSingle_service = async (id: string): Promise<TPhoneBook | null> => {
  const data = await PhoneBookModel.findById(id);
  return data;
};

export const update_service = async (id: string, payload: TPhoneBook): Promise<TPhoneBook | null> => {
  const data = await PhoneBookModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<TPhoneBook | null> => {
  const data = await PhoneBookModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await PhoneBookModel.deleteMany(ids);
  return data;
};

