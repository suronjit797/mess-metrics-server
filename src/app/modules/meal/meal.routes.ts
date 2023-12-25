import express from "express";
import * as mealController from "./meal.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";

const mealRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

// !will be accessible only by admin or superAdmin
mealRouter.get("/", auth(), mealController.getAll);
mealRouter.post("/", auth(), mealController.create);
mealRouter.put("/", auth(), mealController.updateMeal);
mealRouter.post("/remove-many", auth(), mealController.removeMulti);

// with params
mealRouter.get("/:id", auth(), mealController.getSingle);
mealRouter.delete("/:id", auth(), mealController.getSingle);

export default mealRouter;
