import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MessAccountModel from "./messAccount.model";
import { TMessAccount } from "./messAccount.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  payload: Partial<TMessAccount>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMessAccount | null> => {
  await MessAccountModel.updateMany({ mess: payload.mess }, { isActive: false });
  const body = { ...payload };
  if (!body.mess) {
    body.mess = user.mess;
  }

  console.log({ body, user });

  return await MessAccountModel.create(body);
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MessAccountModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MessAccountModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<TMessAccount | null> => {
  const data = await MessAccountModel.findById(id).populate("mess");
  return data;
};
export const update_service = async (id: string, payload: TMessAccount): Promise<TMessAccount | null> => {
  return await MessAccountModel.findByIdAndUpdate(id, payload, { new: true });
};
export const remove_service = async (id: string): Promise<any> => {
  const data = await MessAccountModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await MessAccountModel.deleteMany(ids);
  return data;
};
