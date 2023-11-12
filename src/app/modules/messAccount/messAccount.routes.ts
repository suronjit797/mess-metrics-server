import express from "express";
import * as messAccountController from "./messAccount.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createMessAccountCoZod, updateMessAccountCoZod } from "./messAccount.validation";

const messAccountCoRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

messAccountCoRouter.get("/", auth(member, manager), messAccountController.getAll);
// messAccountCoRouter.post("/", auth(member, manager), validatorMiddleware(createMessAccountCoZod), messAccountController.create);
// messAccountCoRouter.post("/delete-many",auth(admin),  messAccountController.removeMany);

messAccountCoRouter.get("/:id", auth(manager, member), messAccountController.getSingle);
// messAccountCoRouter.put("/:id", auth(admin, manager, viceManager), validatorMiddleware(updateMessAccountCoZod), messAccountController.update);
// messAccountCoRouter.delete("/:id", auth(admin, manager), messAccountController.remove);

export default messAccountCoRouter;
