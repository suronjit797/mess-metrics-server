import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../../../shared/globalInterfaces";
import { TMessAccount } from "./actions.interface";
import BazarModel from "../bazar/bazar.model";
import SharedCostModel from "../sharedCost/sharedCost.model";
import MessModel from "../mess/mess.model";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import MonthModel from "../month/month.model";
import MealModel from "../meal/meal.model";
import DepositModel from "../deposit/deposit.model";
import IndividualCostModel from "../individualCost/individualCost.model";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";
import MemberAccountModel from "../memberAccount/memberAccount.model";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const messAccount = {
  balance: 0,
  totalDeposit: 0,
  totalMealCost: 0,
  totalMeal: 0,
  mealRate: 0,
  totalIndividualCost: 0,
  sharedCost: 0,
  sharedCostPerPerson: 0,
  totalCost: 0,
};

export const getMessAccount_service = async (user: JwtPayload | CustomJwtPayload): Promise<TMessAccount> => {
  try {
    const mess = await MessModel.findById(user.mess).populate([
      { path: "manager", select: "-password" },
      { path: "members", select: "-password" },
    ]);

    if (!mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Mess not found");
    }

    const filter = { mess: user.mess, month: user.activeMonth };

    // find all
    const [bazarList, depositList, mealList, sharedCostList, individualCostList, month, membersCount] =
      await Promise.all([
        BazarModel.find(filter),
        DepositModel.find(filter),
        MealModel.find({ mess: user.mess, activeMonth: user.activeMonth }),
        SharedCostModel.find(filter),
        IndividualCostModel.find(filter),
        MonthModel.findById(user.activeMonth),
        MemberAccountModel.countDocuments(filter),
      ]);

    //  calculations
    const totalMealCost = bazarList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
    const totalDeposit = depositList.reduce((accumulator, deposit) => accumulator + deposit.amount, 0);
    const totalMeal = mealList.reduce((accumulator, meal) => accumulator + meal.meal, 0);
    const mealRate = totalMeal > 0 && totalMealCost > 0 ? Number(totalMealCost / totalMeal) : 0;
    const sharedCost = sharedCostList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
    const sharedCostPerPerson = sharedCost > 0 ? Number(sharedCost / membersCount) : 0;
    const totalIndividualCost = individualCostList.reduce((accumulator, cost) => accumulator + cost.amount, 0);
    const totalCost = totalMealCost + sharedCost + totalIndividualCost;
    const balance = totalDeposit - totalCost;

    return {
      ...messAccount,
      totalCost,
      totalMealCost,
      sharedCost,
      mess,
      month,
      totalMeal,
      sharedCostPerPerson,
      mealRate,
      totalDeposit,
      balance,
      totalIndividualCost,
    };
  } catch (error) {
    throw new Error(error as "string | undefined");
  }
};

export const getMembersAccount_service = async (
  user: JwtPayload | CustomJwtPayload,
  params: { userId: string; monthId: string }
): Promise<any> => {
  const { userId, monthId } = params;

  const isAuthority = user.role === userRole.superAdmin || user.role === userRole.admin;

  const mess = await MessModel.findById(user.mess).populate([
    { path: "manager", select: "-password" },
    { path: "members", select: "-password" },
  ]);

  if (!mess && !isAuthority) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid mess");
  }

  let profile: any;

  if (isAuthority) {
    profile = await UserModel.findById(userId).select("name email phone role dateOfBirth image");
  } else {
    profile = await UserModel.findOne({ _id: userId, mess: user.mess }).select(
      "name email phone role dateOfBirth image"
    );
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User");
  }

  let monthData: any;
  if (isAuthority) {
    monthData = await MonthModel.findById(monthId).select({ createdAt: 0, updatedAt: 0, __v: 0 });
  } else {
    monthData = await MonthModel.findOne({ _id: monthId, mess: user.mess }).select({
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
  }

  if (!monthData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Month");
  }

  const filter = { mess: user.mess, month: new ObjectId(monthId) };

  console.log(filter);

  // find all
  const [bazarList, myDepositList, mealList, myMealList, sharedCostList, individualCostList, membersCount] =
    await Promise.all([
      BazarModel.find(filter),
      DepositModel.find({ ...filter, user: userId }),
      MealModel.find({ mess: user.mess, activeMonth: user.activeMonth }),
      MealModel.find({ mess: user.mess, activeMonth: user.activeMonth, user: userId }),
      SharedCostModel.find(filter),
      IndividualCostModel.find({ ...filter, user: userId }),
      MemberAccountModel.countDocuments(filter),
    ]);

  //  calculations
  const deposit = myDepositList.reduce((accumulator, deposit) => accumulator + deposit.amount, 0);
  const totalMeal = mealList.reduce((accumulator, m) => accumulator + m.meal, 0);
  const meal = myMealList.reduce((accumulator, m) => accumulator + m.meal, 0);

  const individualCost = individualCostList.reduce((accumulator, cost) => accumulator + cost.amount, 0);
  const totalMealCost = bazarList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
  const sharedCost = sharedCostList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);
  const sharedCostPerPerson = sharedCost && membersCount > 0 ? Number(sharedCost / membersCount) : 0;
  const mealRate = totalMeal > 0 && totalMealCost > 0 ? Number(totalMealCost / totalMeal) : 0;
  const mealCost = mealRate * meal;
  const totalCost = mealCost + individualCost + sharedCostPerPerson;
  const balance = deposit - totalCost;

  const month = {
    ...monthData._doc,
    meal,
    totalCost,
    mealCost,
    individualCost,
    sharedCostPerPerson,
    sharedCost,
    deposit,
    balance,
    mealRate,
  };

  return { ...profile._doc, month };
};
