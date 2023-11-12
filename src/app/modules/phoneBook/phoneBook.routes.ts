import express from "express";
import * as phoneBookController from "./phoneBook.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createPhoneBookZod, updatePhoneBookZod } from "./phoneBook.validation";

const phoneBookRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

phoneBookRouter.get("/", auth(admin, manager), phoneBookController.getAll);
phoneBookRouter.post("/", auth(), validatorMiddleware(createPhoneBookZod), phoneBookController.create);
phoneBookRouter.get("/mess-phone-book", auth(), phoneBookController.getMessPhoneBook);
phoneBookRouter.post("/delete-many", auth(admin, manager), phoneBookController.removeMany);

phoneBookRouter.get("/:id", auth(manager, admin), phoneBookController.getSingle);
phoneBookRouter.put("/:id", auth(manager, admin), validatorMiddleware(updatePhoneBookZod), phoneBookController.update);
phoneBookRouter.delete("/:id", auth(manager, admin), phoneBookController.remove);

export default phoneBookRouter;
