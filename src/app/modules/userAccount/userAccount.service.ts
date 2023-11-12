import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MemberAccountModel from "./userAccount.model";
import { TMemberAccount } from "./userAccount.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  payload: Partial<TMemberAccount>,
  user: CustomJwtPayload | JwtPayload
): Promise<TMemberAccount | null> => {
  await MemberAccountModel.updateMany({ mess: payload.mess }, { isActive: false });
  const body = { ...payload };
  if (!body.mess) {
    body.mess = user.mess;
  }

  console.log({ body, user });

  return await MemberAccountModel.create(body);
};

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MemberAccountModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MemberAccountModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<TMemberAccount | null> => {
  const data = await MemberAccountModel.findById(id).populate("mess");
  return data;
};
export const update_service = async (id: string, payload: TMemberAccount): Promise<TMemberAccount | null> => {
  return await MemberAccountModel.findByIdAndUpdate(id, payload, { new: true });
};
export const remove_service = async (id: string): Promise<TMemberAccount | null> => {
  const data = await MemberAccountModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await MemberAccountModel.deleteMany(ids);
  return data;
};
