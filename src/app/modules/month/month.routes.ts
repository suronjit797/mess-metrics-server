import express from "express";
import * as monthController from "./month.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createMonthZod, updateMonthZod } from "./month.validation";

const monthRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

monthRouter.get("/", auth(member, manager), monthController.getAll);
monthRouter.post("/", auth(member, manager), validatorMiddleware(createMonthZod), monthController.create);
monthRouter.post("/delete-many",auth(admin),  monthController.removeMany);

monthRouter.get("/:id", auth(manager, member), monthController.getSingle);
monthRouter.put("/:id", auth(admin, manager, viceManager), validatorMiddleware(updateMonthZod), monthController.update);
monthRouter.delete("/:id", auth(admin, manager), monthController.remove);

export default monthRouter;
