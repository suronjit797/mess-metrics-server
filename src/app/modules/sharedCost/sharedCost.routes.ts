import express from "express";
import * as sharedCostController from "./sharedCost.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createSharedCostZod, updateSharedCostZod } from "./sharedCost.validation";

// ! not work with access

const sharedCostRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;
sharedCostRouter.get("/", auth(), sharedCostController.getAll);
sharedCostRouter.post("/", auth(), validatorMiddleware(createSharedCostZod), sharedCostController.create);
sharedCostRouter.get("/last", auth(), sharedCostController.getLast);
sharedCostRouter.post("/remove-many", auth(), sharedCostController.removeMany);

// with params
sharedCostRouter.get("/:id", auth(), sharedCostController.getSingle);
sharedCostRouter.put("/:id", auth(), validatorMiddleware(updateSharedCostZod), sharedCostController.update);
sharedCostRouter.delete("/:id", auth(), sharedCostController.remove);

export default sharedCostRouter;
