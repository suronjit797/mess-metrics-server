import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import BazarModel from "./bazar.model";
import { TBazar } from "./bazar.interface";
import { JwtPayload } from "jsonwebtoken";

export const create_service = async (
  body: Partial<TBazar>,
  user: CustomJwtPayload | JwtPayload
): Promise<TBazar | null> => {
  const data = { ...body, manager: user.userId, month: user.activeMonth, mess: user.mess };
  const bazar = await BazarModel.create(data);
  return bazar;
};

// ! only access own mess
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await BazarModel.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortCondition)
    .populate({ path: "members", select: "name email role" });
  const total = await BazarModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};

// ! only access own mess
export const getSingle_service = async (id: string): Promise<TBazar | null> => {
  const data = await BazarModel.findById(id).populate([
    {
      path: "members",
      select: "-password",
    },
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

export const getLast_service = async (user: JwtPayload | CustomJwtPayload): Promise<TBazar | null> => {
  const data = await BazarModel.findOne({ mess: user.mess, month: user.activeMonth }).sort({ createdAt: -1 }).populate({
    path: "members",
    select: "-password",
  });
  return data;
};

export const update_service = async (id: string, payload: Partial<TBazar>): Promise<TBazar | null> => {
  const data = await BazarModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};

export const remove_service = async (id: string): Promise<any> => {
  const data = await BazarModel.findByIdAndDelete(id);
  return data;
};

export const removeMany_service = async (ids: string[]): Promise<any> => {
  const data = await BazarModel.deleteMany(ids);
  return data;
};
