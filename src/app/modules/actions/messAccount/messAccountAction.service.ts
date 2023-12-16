import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { CustomJwtPayload } from "../../../../shared/globalInterfaces";
import { TMessAccount } from "../../messAccount/messAccount.interface";
import MessAccountModel from "../../messAccount/messAccount.model";
import ApiError from "../../../../ApiError";
import httpStatus from "http-status";

const { ObjectId } = Types;

export const getMessAccount_service = async (user: JwtPayload | CustomJwtPayload): Promise<any> => {
  try {
    return await MessAccountModel.findOne({ mess: user.mess, month: user.activeMonth });
  } catch (error) {
    throw new Error(error as "string | undefined");
  }
};
export const addTotalMealCost_service = async (
  user: JwtPayload | CustomJwtPayload,
  id: string,
  payload: TMessAccount
): Promise<any> => {
  console.log(id, payload);
  try {
    const data = await MessAccountModel.findByIdAndUpdate(
      id,
      {
        $inc: { totalMealCost: payload.totalMealCost, totalCost: payload.totalMealCost },
      },
      { new: true }
    );
    return data;
  } catch (error) {
    throw new Error(error as "string | undefined");
  }
};
