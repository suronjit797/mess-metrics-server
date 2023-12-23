import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../../../../shared/globalInterfaces";
import { TMessAccount } from "./messAccount.interface";
import BazarModel from "../../bazar/bazar.model";
import SharedCostModel from "../../sharedCost/sharedCost.model";

const messAccount = {
  balance: 0,
  totalDeposit: 0,
  totalCost: 0, //done
  totalMeal: 0,
  totalMealCost: 0, //done
  sharedCost: 0, //done
  totalIndividualCost: 0,
};

export const getMessAccount_service = async (user: JwtPayload | CustomJwtPayload): Promise<TMessAccount> => {
  try {
    // bazar list
    const bazarList = await BazarModel.find({ mess: user.mess, month: user.activeMonth });
    const totalMealCost = bazarList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);

    // shared cost
    const sharedCostList = await SharedCostModel.find({ mess: user.mess, month: user.activeMonth });
    const sharedCost = sharedCostList.reduce((accumulator, bazar) => accumulator + bazar.amount, 0);

    // todo add all cost to find total cost
    const totalCost = Number(totalMealCost + sharedCost);

    // replace other accounts
    const data = { ...messAccount, totalCost, totalMealCost, sharedCost };

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
