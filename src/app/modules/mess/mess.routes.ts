import express from "express";
import * as messController from "./mess.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createMessZod, updateMessZod } from "./mess.validation";

const messRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

messRouter.get("/", auth(admin), messController.getAll);
messRouter.post("/", auth(), validatorMiddleware(createMessZod), messController.create);
messRouter.get("/:id", auth(), messController.getSingle);
messRouter.put("/:id", auth(admin, manager, viceManager), validatorMiddleware(updateMessZod), messController.update);
messRouter.delete("/:id", auth(admin, manager), messController.remove);
messRouter.post("/delete-many", messController.removeMany);

export default messRouter;
