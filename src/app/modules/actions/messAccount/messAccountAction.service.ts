import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../../../../shared/globalInterfaces";
import { TMessAccount } from "./messAccount.interface";
import BazarModel from "../../bazar/bazar.model";
import SharedCostModel from "../../sharedCost/sharedCost.model";
import MessModel from "../../mess/mess.model";
import ApiError from "../../../../ApiError";
import httpStatus from "http-status";
import MonthModel from "../../month/month.model";
import MealModel from "../../meal/meal.model";
import UserModel from "../../user/user.model";

const messAccount = {
  balance: 0,
  totalDeposit: 0,
  totalMealCost: 0, //done
  totalMeal: 0, //done
  mealRate: 0,
  totalIndividualCost: 0,
  sharedCost: 0, //done
  sharedCostPerPerson: 0, //done
  totalCost: 0, //semi done
};

export const getMessAccount_service = async (user: JwtPayload | CustomJwtPayload): Promise<TMessAccount> => {
  try {
    // bazar list
    const mess = await MessModel.findById(user.mess).populate({
      path: "manager",
      select: "-password",
    });
    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Mess not found");
    }
    const membersCount = await UserModel.countDocuments({ mess: user.mess, activeMonth: user.activeMonth });
    const month = await MonthModel.findById(user.activeMonth);
    // total meal cost
    const bazarList = await BazarModel.find({ mess: user.mess, month: user.activeMonth });
    const totalMealCost = bazarList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
    // total meal
    const mealList = await MealModel.find({ mess: user.mess, activeMonth: user.activeMonth });
    const totalMeal = mealList.reduce((accumulator, meal) => accumulator + meal.meal, 0);
    console.log({ totalMeal, totalMealCost });
    const mealRate = totalMeal > 0 && totalMealCost > 0 ? Number(totalMealCost / totalMeal) : 0;

    // shared cost
    const sharedCostList = await SharedCostModel.find({ mess: user.mess, month: user.activeMonth });
    const sharedCost = sharedCostList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
    const sharedCostPerPerson = sharedCost > 0 ? Number(sharedCost / membersCount) : 0;

    // todo add all cost to find total cost
    const totalCost = Number(totalMealCost + sharedCost);

    // balance

    // replace other accounts
    const data = {
      ...messAccount,
      totalCost,
      totalMealCost,
      sharedCost,
      mess,
      month,
      totalMeal,
      sharedCostPerPerson,
      mealRate,
    };

    // console.log(data);

    return data;
  } catch (error) {
    throw new Error(error as "string | undefined");
  }
};

// export const addTotalMealCost_service = async (
//   user: JwtPayload | CustomJwtPayload,
//   id: string,
//   payload: TMessAccount
// ): Promise<any> => {
//   console.log(id, payload);
//   try {
//     const data = await MessAccountModel.findByIdAndUpdate(
//       id,
//       {
//         $inc: { totalMealCost: payload.totalMealCost, totalCost: payload.totalMealCost },
//       },
//       { new: true }
//     );
//     return data;
//   } catch (error) {
//     throw new Error(error as "string | undefined");
//   }
// };
