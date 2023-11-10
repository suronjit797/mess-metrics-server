import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MonthModel from "./month.model";
import { TMonth } from "./month.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  payload: Partial<TMonth>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMonth | null> => {
  await MonthModel.updateMany({ mess: payload.mess }, { isActive: false });
  const body = { ...payload };
  if (!body.mess) {
    body.mess = user.mess;
  }

  console.log({ body, user });

  return await MonthModel.create(body);
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
export const remove_service = async (id: string): Promise<TMonth | null> => {
  const data = await MonthModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await MonthModel.deleteMany(ids);
  return data;
};
