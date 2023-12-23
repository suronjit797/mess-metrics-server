import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MealModel from "./meal.model";
import { TCreateMealPayload, TMeal } from "./meal.interface";
import { Types } from "mongoose";
import { userRole } from "../../../constants/userConstants";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";

const { ObjectId } = Types;

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MealModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MealModel.countDocuments(filter);
  return { meta: { page, limit, total }, data };
};

export const create_service = async (
  jwtPayload: JwtPayload | CustomJwtPayload,
  payload: TCreateMealPayload
): Promise<any> => {
  const { mess, activeMonth } = jwtPayload;
  const { date, meals } = payload;

  const mealDocuments = meals.map(({ user, meal }) => ({
    date,
    mess,
    activeMonth,
    user: new ObjectId(user),
    meal,
  }));

  const meal = await MealModel.insertMany(mealDocuments);
  return meal;
};

export const getSingle_service = async (user: CustomJwtPayload | JwtPayload, id: string): Promise<TMeal | null> => {
  let data;
  if ([userRole.admin, userRole.superAdmin].includes(user.role)) {
    data = await MealModel.findById(id);
  } else {
    if (!user.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "bad request");
    }
    const mess = await MealModel.findById(user.mess);
    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "bad request");
    }
    data = await MealModel.findOne({ _id: new ObjectId(id), mess: user.mess });
  }
  return data;
};
