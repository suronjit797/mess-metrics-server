import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import IndividualCostModel from "./individualCost.model";
import { TIndividualCost } from "./individualCost.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  body: Partial<TIndividualCost>,
  user: CustomJwtPayload | JwtPayload
): Promise<TIndividualCost | null> => {
  const payload = { ...body, manager: user.userId, month: user.activeMonth, mess: user.mess };
  const data = await IndividualCostModel.create(payload);
  return data;
};

// ! only access own mess
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await IndividualCostModel.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortCondition)
    .populate({ path: "user", select: "name email role" });
  const total = await IndividualCostModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

// ! only access own mess
export const getSingle_service = async (id: string): Promise<TIndividualCost | null> => {
  const data = await IndividualCostModel.findById(id).populate([
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

export const getLast_service = async (user: JwtPayload | CustomJwtPayload): Promise<TIndividualCost | null> => {
  const data = await IndividualCostModel.findOne({ mess: user.mess, month: user.activeMonth }).sort({ createdAt: -1 });
  return data;
};

export const update_service = async (
  id: string,
  payload: Partial<TIndividualCost>
): Promise<TIndividualCost | null> => {
  const data = await IndividualCostModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await IndividualCostModel.findByIdAndDelete(id);
  console.log(data);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await IndividualCostModel.deleteMany(ids);
  return data;
};
