import express from "express";
import * as depositController from "./deposit.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createDepositZod, updateDepositZod } from "./deposit.validation";

// ! not work with access

const depositRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

depositRouter.get("/", auth(), depositController.getAll);
depositRouter.post("/", auth(), validatorMiddleware(createDepositZod), depositController.create);
depositRouter.post("/remove-many", auth(), depositController.removeMany);

// with params
depositRouter.get("/:id", auth(), depositController.getSingle);
depositRouter.put("/:id", auth(), validatorMiddleware(updateDepositZod), depositController.update);
depositRouter.delete("/:id", auth(), depositController.remove);

export default depositRouter;
