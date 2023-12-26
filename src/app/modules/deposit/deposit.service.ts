import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import DepositModel from "./deposit.model";
import { TDeposit } from "./deposit.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  body: Partial<TDeposit>,
  user: CustomJwtPayload | JwtPayload
): Promise<TDeposit | null> => {
  const payload = { ...body, manager: user.userId, month: user.activeMonth, mess: user.mess };
  const data = await DepositModel.create(payload);
  return data;
};

// ! only access own mess
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await DepositModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await DepositModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

// ! only access own mess
export const getSingle_service = async (id: string): Promise<TDeposit | null> => {
  const data = await DepositModel.findById(id).populate([
    {
      path: "month",
    },
    {
      path: "manager",
      select: "-password",
    },{
      path: "user",
      select: "-password",
    },
    {
      path: "mess",
    },
  ]);
  return data;
};


export const update_service = async (id: string, payload: Partial<TDeposit>): Promise<TDeposit | null> => {
  const data = await DepositModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await DepositModel.findByIdAndDelete(id);
  console.log(data);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await DepositModel.deleteMany(ids);
  return data;
};
