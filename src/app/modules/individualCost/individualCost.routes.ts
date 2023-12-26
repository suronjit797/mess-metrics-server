import express from "express";
import * as individualCostController from "./individualCost.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createIndividualCostZod, updateIndividualCostZod } from "./individualCost.validation";

// ! not work with access

const individualCostRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;
individualCostRouter.get("/", auth(), individualCostController.getAll);
individualCostRouter.post("/", auth(), validatorMiddleware(createIndividualCostZod), individualCostController.create);
individualCostRouter.get("/last", auth(), individualCostController.getLast);
individualCostRouter.post("/remove-many", auth(), individualCostController.removeMany);

// with params
individualCostRouter.get("/:id", auth(), individualCostController.getSingle);
individualCostRouter.put("/:id", auth(), validatorMiddleware(updateIndividualCostZod), individualCostController.update);
individualCostRouter.delete("/:id", auth(), individualCostController.remove);

export default individualCostRouter;
