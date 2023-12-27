import express from "express";
// import * as mealActionController from "./meal/mealAction.controller";
import * as actionsController from "./actions.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { getMembersAccountZod } from "./actions.validation";

const actionsRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

// mess Account

// todo: already add [meal cost]
actionsRouter.get("/mess-account", auth(), actionsController.getMessAccount);
actionsRouter.get("/user-account", validatorMiddleware(getMembersAccountZod), auth(), actionsController.getUserAccount);


// with params

export default actionsRouter;
