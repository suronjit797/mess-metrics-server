import { TMess } from "../mess/mess.interface";
import { TMonth } from "../month/month.interface";

export type TMessAccount = {
  balance: number;
  totalDeposit: number;
  totalCost: number;
  totalMeal: number;
  totalMealCost: number;
  sharedCost: number;
  sharedCostPerPerson: number;
  totalIndividualCost: number;
  mealRate: number;
  mess: TMess;
  month: TMonth | null;
};
