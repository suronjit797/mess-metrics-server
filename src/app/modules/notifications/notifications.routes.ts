import express from "express";
import * as notificationsController from "./notifications.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createNotificationsZod, updateSNotificationsZod } from "./notifications.validation";

// ! not work with access

const notificationsRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;
notificationsRouter.get("/", auth(), notificationsController.getAll);
notificationsRouter.post("/", auth(), validatorMiddleware(createNotificationsZod), notificationsController.create);
notificationsRouter.post("/remove-many", auth(), notificationsController.removeMany);
notificationsRouter.put("/read-all", auth(), notificationsController.readAll);

// with params
notificationsRouter.get("/:id", auth(), notificationsController.getSingle);
notificationsRouter.put("/:id", auth(), validatorMiddleware(updateSNotificationsZod), notificationsController.update);
notificationsRouter.delete("/:id", auth(), notificationsController.remove);

export default notificationsRouter;
