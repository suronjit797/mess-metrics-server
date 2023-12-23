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

// with params
mealRouter.get("/:id", auth(), mealController.getAll);



// mealRouter.get("/members", auth(), messController.getMembers);
// mealRouter.post("/", auth(member, manager), validatorMiddleware(createMessZod), messController.create);
// mealRouter.post("/delete-many", messController.removeMany);
// mealRouter.put(
//   "/change-manager/:id",
//   validatorMiddleware(changeManagerZod),
//   auth(admin, manager),
//   messController.changeManager
// );

// mealRouter.post(
//   "/remove-members/:id",
//   auth(admin, manager),
//   validatorMiddleware(removeMemberZod),
//   messController.removeMembers
// );
// mealRouter.post("/add-member/:id", auth(admin, manager), validatorMiddleware(addMemberZod), messController.addMembers);

// mealRouter.get("/:id", auth(), messController.getSingle);
// mealRouter.put("/:id", auth(admin, manager, viceManager), validatorMiddleware(updateMessZod), messController.update);
// mealRouter.delete("/:id", auth(admin, manager), messController.remove);

export default mealRouter;
