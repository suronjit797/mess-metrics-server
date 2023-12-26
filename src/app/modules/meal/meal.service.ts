import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import MealModel from "./meal.model";
import { TCreateMealPayload, TMeal } from "./meal.interface";
import { Types } from "mongoose";
import { userRole } from "../../../constants/userConstants";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import MessModel from "../mess/mess.model";
import UserModel from "../user/user.model";

const { ObjectId } = Types;

export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MealModel.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortCondition)
    .populate({ path: "user", select: "name email role" });
  const total = await MealModel.countDocuments(filter);
  return { meta: { page, limit, total }, data };
};

export const create_service = async (
  jwtPayload: JwtPayload | CustomJwtPayload,
  payload: TCreateMealPayload
): Promise<any> => {
  const { mess, activeMonth } = jwtPayload;
  const { date, meals } = payload;

  console.log(meals);
  const mealDocuments = await Promise.all(
    meals.map(async ({ id, meal }) => {
      const isExist = await UserModel.findOne({ _id: new ObjectId(id), mess: new ObjectId(jwtPayload.mess) });
      if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, `User not found with this id "${id}" in your mess`);
      }
      return {
        date,
        mess,
        activeMonth,
        user: new ObjectId(id),
        meal,
      };
    })
  );
  const meal = await MealModel.insertMany(mealDocuments);
  return meal;
};

export const getSingle_service = async (user: CustomJwtPayload | JwtPayload, id: string): Promise<TMeal | null> => {
  let data;
  if ([userRole.admin, userRole.superAdmin].includes(user.role)) {
    data = await MealModel.findById(id).populate("mess activeMonth user");
  } else {
    if (!user.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "user has not any mess");
    }
    const mess = await MessModel.findById(user.mess);
    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Mess not found");
    }
    data = await MealModel.findOne({ _id: new ObjectId(id), mess: user.mess }).populate("mess activeMonth user");
  }
  return data;
};

export const updateMeal_service = async (
  jwtPayload: JwtPayload | CustomJwtPayload,
  payload: TCreateMealPayload
): Promise<any> => {
  const { mess, activeMonth } = jwtPayload;
  const { date, meals } = payload;

  const bulkUpdateOperations:any = await Promise.all(
    meals.map(async ({ id, meal }) => {
      const isExist = await UserModel.findOne({ _id: new ObjectId(id), mess: new ObjectId(jwtPayload.mess) });
      if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, `User not found with this id "${id}" in your mess`);
      }
      return {
        updateOne: {
          filter: { mess, activeMonth, user: id, date },
          update: { $set: { meal } },
          upsert: true,
        },
      };
    })
  );

  // const bulkUpdateOperations: any = meals.map(({ id, meal }) => ({
  //   updateOne: {
  //     filter: { mess, activeMonth, user: id, date },
  //     update: { $set: { meal } },
  //     upsert: true,
  //   },
  // }));

  const meal = await MealModel.bulkWrite(bulkUpdateOperations);

  console.log(meal);

  // const meal = await MealModel.insertMany(mealDocuments);
  return meal;
};

export const removeSingle_service = async (user: CustomJwtPayload | JwtPayload, id: string): Promise<any> => {
  let data;
  if ([userRole.admin, userRole.superAdmin].includes(user.role)) {
    data = await MealModel.findByIdAndDelete(id);
  } else {
    if (!user.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "user has not any mess");
    }
    const mess = await MessModel.findById(user.mess);
    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Mess not found");
    }
    data = await MealModel.findOneAndDelete({ _id: new ObjectId(id), mess: user.mess });
  }
  return data;
};

export const removeMulti_service = async (user: CustomJwtPayload | JwtPayload, ids: string[]): Promise<any> => {
  const filter: any = { _id: { $in: ids } };
  if (![userRole.admin, userRole.superAdmin].includes(user.role)) {
    if (!user.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "user has not any mess");
    }
    const mess = await MessModel.findById(user.mess);
    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Mess not found");
    }
    filter.mess = user.mess;
  }
  const data = await MealModel.deleteMany(filter);
  return data;
};
