import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import PersonalAccountModel from "./personalAccount.model";
import { TPersonalAccount } from "./personalAccount.interface";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";

export const create_service = async (
  payload: TPersonalAccount,
  user: CustomJwtPayload | JwtPayload
): Promise<TPersonalAccount | null> => {
  const body = { ...payload, mess: user.mess };

  const data = await PersonalAccountModel.create(body);
  return data;
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await PersonalAccountModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await PersonalAccountModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

export const getSingle_service = async (id: string): Promise<TPersonalAccount | null> => {
  const data = await PersonalAccountModel.findById(id);
  return data;
};

export const update_service = async (id: string, payload: TPersonalAccount): Promise<TPersonalAccount | null> => {
  const data = await PersonalAccountModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<TPersonalAccount | null> => {
  const data = await PersonalAccountModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await PersonalAccountModel.deleteMany(ids);
  return data;
};

