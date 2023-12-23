import express from "express";
// import * as mealActionController from "./meal/mealAction.controller";
import * as messAccountActionController from "./messAccount/messAccountAction.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { addMemberZod, changeManagerZod, createMessZod, removeMemberZod, updateMessZod } from "./actions.validation";

const actionsRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;



// !not valid have to remove or modify 
// meal
// actionsRouter.post("/add-meal", auth(), mealActionController.addMeal);
// actionsRouter.get("/meal-by-date", auth(), mealActionController.getMealByDate);
// actionsRouter.put("/meal/:id", auth(), mealActionController.updateMeal);

// mess Account

// todo: already add [meal cost] 
actionsRouter.get("/mess-account", auth(), messAccountActionController.getMessAccount);


// params


export default actionsRouter;
