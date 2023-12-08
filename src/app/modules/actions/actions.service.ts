import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";
import { Types } from "mongoose";

import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";
import PhoneBookModel from "../phoneBook/phoneBook.model";
import { TCreateMeal } from "../meal/mess.interface";
import MealModel from "../meal/mess.model";
import PersonalAccountModel from "../personalAccount/personalAccount.model";
import MemberAccountModel from "../userAccount/userAccount.model";

const { ObjectId } = Types;

export const addMeal_service = async (payload: TCreateMeal, user: JwtPayload | CustomJwtPayload): Promise<any> => {
  try {
    const { date, meal } = payload;
    const cratedMeal = await MealModel.create(payload);

    const updatePromises = meal?.map(async (e) => {
      console.log({ mess: user.mess, month: user.activeMonth, user: e.id });
      await MemberAccountModel.updateMany(
        { mess: user.mess, month: user.activeMonth, user: new ObjectId(e.id) },
        { $inc: { meal: e.meal } }
      );
    });

    await Promise.all(updatePromises || []);
  } catch (error) {
    console.log(error);
    throw new Error(error as "string | undefined");
  }
};
