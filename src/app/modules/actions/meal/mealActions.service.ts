import { CustomJwtPayload, IPagination } from "../../../../shared/globalInterfaces";
import { Types } from "mongoose";

import ApiError from "../../../../ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { JwtPayload } from "jsonwebtoken";
import { TCreateMeal } from "../../meal/mess.interface";
import MealModel from "../../meal/mess.model";
import MemberAccountModel from "../../userAccount/userAccount.model";

const { ObjectId } = Types;

export const addMeal_service = async (payload: TCreateMeal, user: JwtPayload | CustomJwtPayload): Promise<any> => {
  try {
    const { date, meal } = payload;
    const cratedMeal = await MealModel.create({ ...payload, mess: user.mess, activeMonth: user.activeMonth });

    const updatePromises = meal?.map(async (e) => {
      console.log({ mess: user.mess, month: user.activeMonth, user: e.id });
      await MemberAccountModel.updateMany(
        { mess: user.mess, month: user.activeMonth, user: new ObjectId(e.id) },
        { $inc: { meal: e.meal } },
        { upsert: true }
      );
    });

    await Promise.all(updatePromises || []);

    return cratedMeal;
  } catch (error) {
    console.log(error);
    throw new Error(error as "string | undefined");
  }
};

export const getMealByDate_Service = async (
  user: JwtPayload | CustomJwtPayload,
  query: string | undefined
): Promise<TCreateMeal | null> => {
  const date = query || moment(new Date()).format("DD-MM-yyyy");
  console.log(date);
  try {
    const data = await MealModel.findOne({ mess: user.mess, date }).populate("meal.id", "name email image");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error as "string | undefined");
  }
};

import mongoose from "mongoose";

export const updateMeal_Service = async (id: string, payload: TCreateMeal): Promise<TCreateMeal | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mealData = await MealModel.findById(id).session(session);

    if (!mealData) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Request");
    }

    const updatePromises = payload.meal?.map(async (e) => {
      const findData = mealData.meal.find((d) => new ObjectId(d.id).equals(e.id));

      let changeNumber = 0;
      if (findData) {
        changeNumber = e.meal - findData.meal;
      }

      console.log({ mess: mealData.mess, month: mealData.activeMonth, user: new ObjectId(e.id) });
      await MemberAccountModel.updateOne(
        { mess: mealData.mess, month: mealData.activeMonth, user: new ObjectId(e.id) },
        { $inc: { meal: changeNumber } },
        { session, upsert: true }
      );
    });

    await Promise.all(updatePromises || []);

    const updatedData = mealData?.meal?.map((meal) => {
      payload?.meal?.forEach((data: { meal: number; id: string }) => {
        if (new ObjectId(meal.id).equals(data.id)) {
          meal.meal = data.meal;
        }
      });
      return meal;
    });

    const data = await MealModel.findByIdAndUpdate(id, { $set: { meal: updatedData } }, { new: true, session });

    await session.commitTransaction();
    session.endSession();

    return data;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    throw new Error(error as "string | undefined");
  }
};
