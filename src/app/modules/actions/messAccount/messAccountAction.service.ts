import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { CustomJwtPayload } from "../../../../shared/globalInterfaces";
import { TMessAccount } from "../../messAccount/messAccount.interface";
import MessAccountModel from "../../messAccount/messAccount.model";
import ApiError from "../../../../ApiError";
import httpStatus from "http-status";
import BazarModel from "../../bazar/bazar.model";
import { TMess } from "../../mess/mess.interface";
import SharedCostModel from "../../sharedCost/sharedCost.model";

const { ObjectId } = Types;

export const getMessAccount_service = async (user: JwtPayload | CustomJwtPayload): Promise<TMessAccount | null> => {
  try {
    const messAccount = await MessAccountModel.findOne({ mess: user.mess, month: user.activeMonth });

    if (messAccount) {
      // bazar lsit
      const bazarList = await BazarModel.find({ mess: user.mess, month: user.activeMonth });
      const totalMealCost = bazarList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);

      // shared cost
      const sharedCostList = await SharedCostModel.find({ mess: user.mess, month: user.activeMonth });
      const sharedCost = sharedCostList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);

      // todo add all cost to find total cost
      const totalCost = Number(totalMealCost + sharedCost);

      // replace other accounts
      messAccount.totalMealCost = totalMealCost;
      messAccount.totalCost = totalCost;
      messAccount.sharedCost = sharedCost;
    }

    return messAccount;
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
