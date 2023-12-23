import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import SharedCostModel from "./sharedCost.model";
import { TSharedCost } from "./sharedCost.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  body: Partial<TSharedCost>,
  user: CustomJwtPayload | JwtPayload
): Promise<TSharedCost | null> => {
  const payload = { ...body, manager: user.userId, month: user.activeMonth, mess: user.mess };
  const data = await SharedCostModel.create(payload);
  return data;
};

// ! only access own mess
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await SharedCostModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await SharedCostModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

// ! only access own mess
export const getSingle_service = async (id: string): Promise<TSharedCost | null> => {
  const data = await SharedCostModel.findById(id).populate([
    {
      path: "month",
    },
    {
      path: "manager",
      select: "-password",
    },
    {
      path: "mess",
    },
  ]);
  return data;
};

export const getLast_service = async (user: JwtPayload | CustomJwtPayload): Promise<TSharedCost | null> => {
  const data = await SharedCostModel.findOne({ mess: user.mess, month: user.activeMonth }).sort({ createdAt: -1 });
  return data;
};

export const update_service = async (id: string, payload: Partial<TSharedCost>): Promise<TSharedCost | null> => {
  const data = await SharedCostModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await SharedCostModel.findByIdAndDelete(id);
  console.log(data)
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await SharedCostModel.deleteMany(ids);
  return data;
};
