import express from "express";
import * as bazarController from "./bazar.controller";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";
import { createBazarZod, updateBazarZod } from "./bazar.validation";

// ! not work with access

const bazarRouter = express.Router();
const { admin, manager, member, viceManager } = userRole;
bazarRouter.get("/", auth(), bazarController.getAll);
bazarRouter.post("/", auth(), validatorMiddleware(createBazarZod), bazarController.create);
bazarRouter.get("/last", auth(), bazarController.getLast);
bazarRouter.post("/remove-many", auth(), bazarController.removeMany);

// with params
bazarRouter.get("/:id", auth(), bazarController.getSingle);
bazarRouter.put("/:id", auth(), validatorMiddleware(updateBazarZod), bazarController.update);
bazarRouter.delete("/:id", auth(), bazarController.remove);

export default bazarRouter;
