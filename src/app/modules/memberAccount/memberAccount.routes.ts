import express from "express";
import * as memberAccountController from "./memberAccount.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createMessAccountCoZod, updateMessAccountCoZod } from "./memberAccount.validation";

const memberAccountCoRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

memberAccountCoRouter.get("/", auth(member, manager), memberAccountController.getAll);
memberAccountCoRouter.get("/:id", auth(manager, member), memberAccountController.getSingle);

export default memberAccountCoRouter;
