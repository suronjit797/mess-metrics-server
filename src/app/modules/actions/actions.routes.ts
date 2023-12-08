import express from "express";
import * as messController from "./actions.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { addMemberZod, changeManagerZod, createMessZod, removeMemberZod, updateMessZod } from "./actions.validation";

const actionsRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

actionsRouter.post("/add-meal", auth(), messController.addMeal);

export default actionsRouter;
