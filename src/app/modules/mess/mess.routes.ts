import express from "express";
import * as messController from "./mess.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { addMemberZod, changeManagerZod, createMessZod, removeMemberZod, updateMessZod } from "./mess.validation";

const messRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;

messRouter.get("/", auth(), messController.getAll);
messRouter.get("/members", auth(), messController.getMembers);
messRouter.get("/member-with-services", auth(), messController.getMembersWithServices);
messRouter.post("/", auth(member, manager), validatorMiddleware(createMessZod), messController.create);
messRouter.post("/delete-many", messController.removeMany);
messRouter.put(
  "/change-manager/:id",
  validatorMiddleware(changeManagerZod),
  auth(admin, manager),
  messController.changeManager
);

messRouter.post(
  "/remove-members/:id",
  auth(admin, manager),
  validatorMiddleware(removeMemberZod),
  messController.removeMembers
);
messRouter.post("/add-member/:id", auth(admin, manager), validatorMiddleware(addMemberZod), messController.addMembers);

messRouter.get("/:id", auth(), messController.getSingle);
messRouter.put("/:id", auth(admin, manager, viceManager), validatorMiddleware(updateMessZod), messController.update);
messRouter.delete("/:id", auth(admin, manager), messController.remove);

export default messRouter;
