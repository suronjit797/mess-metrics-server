import express from "express";
import * as personalAccountController from "./personalAccount.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createPersonalAccountZod, updatePersonalAccountZod } from "./personalAccount.validation";

const personalAccountRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

personalAccountRouter.get("/", auth(), personalAccountController.getAll);
personalAccountRouter.post(
  "/",
  auth(),
  validatorMiddleware(createPersonalAccountZod),
  personalAccountController.create
);
personalAccountRouter.post("/delete-many", auth(), personalAccountController.removeMany);

personalAccountRouter.get("/:id", auth(), personalAccountController.getSingle);
personalAccountRouter.put(
  "/:id",
  auth(),
  validatorMiddleware(updatePersonalAccountZod),
  personalAccountController.update
);
personalAccountRouter.delete("/:id", auth(), personalAccountController.remove);

export default personalAccountRouter;
