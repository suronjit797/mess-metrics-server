import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import PhoneBookModel from "./phoneBook.model";
import { TPhoneBook } from "./phoneBook.interface";
import { JwtPayload } from "jsonwebtoken";
import { invalid } from "moment";
import UserModel from "../user/user.model";

export const create_service = async (
  payload: TPhoneBook,
  user: CustomJwtPayload | JwtPayload
): Promise<TPhoneBook | null> => {
  const body = { ...payload, mess: user.mess };

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

export const getMessPhoneBook_service = async (id: string): Promise<any> => {
  if (!id) {
    throw new Error("invalid Mess");
  }

  const user = await UserModel.find({ mess: id }).select({ name: 1, phone: 1, _id: 0 });

  const data = await PhoneBookModel.find({ mess: id }).select({ name: 1, phone: 1 });
  return [...user, ...data];
};
